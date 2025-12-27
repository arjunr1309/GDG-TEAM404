import * as tf from "@tensorflow/tfjs";

export async function detectAnomaly(values: number[]): Promise<boolean[]> {
  if (values.length === 0) return [];
  if (values.length === 1) return [false];

  await tf.ready();

  const tensor = tf.tensor1d(values);

  const { mean, variance } = tf.moments(tensor);
  const std = variance.sqrt();

  const stdValue = (await std.data())[0];
  const safeStd = stdValue === 0 ? tf.scalar(1) : std;

  const zScores = tensor.sub(mean).div(safeStd);
  const anomalies = zScores.abs().greater(3);

  const result = await anomalies.data();
  const boolResult = Array.from(result).map(v => v > 0);

  tensor.dispose();
  mean.dispose();
  variance.dispose();
  std.dispose();
  safeStd.dispose();
  zScores.dispose();
  anomalies.dispose();

  return boolResult;
}