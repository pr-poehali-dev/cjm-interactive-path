import json
import os
import psycopg2
import base64
import boto3
import uuid

SCHEMA = "t_p25303014_cjm_interactive_path"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def get_s3():
    return boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )

def handler(event: dict, context) -> dict:
    """CRUD для ссылок и изображений по шагам CJM."""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    body = json.loads(event.get("body") or "{}")

    # GET /  — получить все данные для всех шагов
    if method == "GET":
        conn = get_conn()
        cur = conn.cursor()

        cur.execute(f"SELECT id, step_id, label, url, created_at FROM {SCHEMA}.cjm_step_links ORDER BY created_at")
        links_rows = cur.fetchall()

        cur.execute(f"SELECT id, step_id, url, caption, created_at FROM {SCHEMA}.cjm_step_images ORDER BY created_at")
        images_rows = cur.fetchall()

        conn.close()

        links = {}
        for row in links_rows:
            sid = row[1]
            if sid not in links:
                links[sid] = []
            links[sid].append({"id": row[0], "step_id": sid, "label": row[2], "url": row[3]})

        images = {}
        for row in images_rows:
            sid = row[1]
            if sid not in images:
                images[sid] = []
            images[sid].append({"id": row[0], "step_id": sid, "url": row[2], "caption": row[3]})

        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({"links": links, "images": images}),
        }

    # POST /link — добавить ссылку
    if method == "POST" and params.get("type") == "link":
        step_id = int(body["step_id"])
        label = body["label"]
        url = body["url"]

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.cjm_step_links (step_id, label, url) VALUES (%s, %s, %s) RETURNING id",
            (step_id, label, url),
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()

        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({"id": new_id, "step_id": step_id, "label": label, "url": url}),
        }

    # POST /image — загрузить изображение в S3
    if method == "POST" and params.get("type") == "image":
        step_id = int(body["step_id"])
        caption = body.get("caption", "")
        image_data = body["image_base64"]
        content_type = body.get("content_type", "image/jpeg")

        # Decode and upload to S3
        image_bytes = base64.b64decode(image_data)
        ext = content_type.split("/")[-1]
        key = f"cjm/step_{step_id}/{uuid.uuid4()}.{ext}"

        s3 = get_s3()
        s3.put_object(Bucket="files", Key=key, Body=image_bytes, ContentType=content_type)
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.cjm_step_images (step_id, url, caption) VALUES (%s, %s, %s) RETURNING id",
            (step_id, cdn_url, caption),
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        conn.close()

        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({"id": new_id, "step_id": step_id, "url": cdn_url, "caption": caption}),
        }

    # DELETE — удалить ссылку или изображение
    if method == "DELETE":
        item_type = params.get("type")
        item_id = int(params.get("id", 0))

        conn = get_conn()
        cur = conn.cursor()

        if item_type == "link":
            cur.execute(f"DELETE FROM {SCHEMA}.cjm_step_links WHERE id = %s", (item_id,))
        elif item_type == "image":
            cur.execute(f"SELECT url FROM {SCHEMA}.cjm_step_images WHERE id = %s", (item_id,))
            row = cur.fetchone()
            cur.execute(f"DELETE FROM {SCHEMA}.cjm_step_images WHERE id = %s", (item_id,))

        conn.commit()
        conn.close()

        return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True})}

    return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Unknown request"})}
