const API_URL = "https://functions.poehali.dev/6240118d-32bb-4862-8cc3-2487e18429bb";

export interface StepLink {
  id: number;
  step_id: number;
  label: string;
  url: string;
}

export interface StepImage {
  id: number;
  step_id: number;
  url: string;
  caption?: string;
}

export interface AllStepData {
  links: Record<number, StepLink[]>;
  images: Record<number, StepImage[]>;
}

export async function fetchAllStepData(): Promise<AllStepData> {
  const res = await fetch(API_URL);
  const data = await res.json();
  return data;
}

export async function addLink(step_id: number, label: string, url: string): Promise<StepLink> {
  const res = await fetch(`${API_URL}?type=link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ step_id, label, url }),
  });
  return res.json();
}

export async function deleteLink(id: number): Promise<void> {
  await fetch(`${API_URL}?type=link&id=${id}`, { method: "DELETE" });
}

export async function addImage(
  step_id: number,
  file: File,
  caption?: string
): Promise<StepImage> {
  const base64 = await fileToBase64(file);
  const res = await fetch(`${API_URL}?type=image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      step_id,
      image_base64: base64,
      content_type: file.type || "image/jpeg",
      caption: caption || "",
    }),
  });
  return res.json();
}

export async function deleteImage(id: number): Promise<void> {
  await fetch(`${API_URL}?type=image&id=${id}`, { method: "DELETE" });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
