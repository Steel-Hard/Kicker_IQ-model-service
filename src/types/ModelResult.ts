import * as ort from 'onnxruntime-node'

type ModelResult = {
    label: ort.Tensor;
    scores: ort.Tensor;
};

export default ModelResult