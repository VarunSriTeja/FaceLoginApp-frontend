import * as faceapi from "face-api.js";

export const loadModels = async () => {
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
};
