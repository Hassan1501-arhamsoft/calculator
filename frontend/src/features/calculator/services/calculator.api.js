import axiosInstance from "../../../api/axiosInstance";

const BASE = "/calculator";

export async function evaluateExpression(expression) {
  const { data } = await axiosInstance.post(`${BASE}/evaluate`, { expression });
  return data;
}

export async function runMatrixOperation({ operation, matrixA, matrixB }) {
  const { data } = await axiosInstance.post(`${BASE}/matrix`, { operation, matrixA, matrixB });
  return data;
}

export async function convertUnit({ category, from, to, value }) {
  const { data } = await axiosInstance.post(`${BASE}/convert`, { category, from, to, value });
  return data;
}

export async function fetchGraphData({ expression, xMin, xMax, steps }) {
  const { data } = await axiosInstance.post(`${BASE}/graph`, { expression, xMin, xMax, steps });
  return data;
}

export async function fetchHistory() {
  const { data } = await axiosInstance.get(`${BASE}/history`);
  return data.items;
}

export async function deleteHistoryItem(id) {
  await axiosInstance.delete(`${BASE}/history/${id}`);
}

export async function clearHistory() {
  await axiosInstance.delete(`${BASE}/history`);
}
