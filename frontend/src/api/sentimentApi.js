export async function analyzeSentiment(text, lang = "es") {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:8080/api/sentiment/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text, lang }),
  });

  if (!res.ok) {
    throw new Error("Error analizando sentimiento");
  }

  return await res.json();
}
