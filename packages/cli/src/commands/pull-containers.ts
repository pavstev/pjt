import { defineCommand } from "citty";

import { execCommand } from "../lib/command";

const IMAGES = [
  // Routing & Serving Infrastructure
  "localai/localai",
  "ollama/ollama",
  "nvcr.io/nvidia/tritonserver",

  // Foundational LLMs (Variations & Alternatives)
  "docker.io/ai/llama3.1",
  "docker.io/ai/mistral",
  "docker.io/ai/mixtral-8x7b",
  "docker.io/ai/qwen3",
  "docker.io/ai/gemma3",
  "docker.io/ai/deepseek-r1-distill",
  "docker.io/ai/phi4",
  "docker.io/ai/solar",

  // More Open-Source LLMs for Routing
  "mistralai/mistral-7b-v0.2",
  "codellama/codellama-7b-instruct-hf",
  "microsoft/phi-2",
  "google/gemma-7b",
  "meta-llama/llama-2-7b-chat",
  "HuggingFaceH4/zephyr-7b-beta",
  "Qwen/Qwen-7B-Chat",
  "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
  "tiiuae/falcon-7b-instruct",
  "deepseek-ai/deepseek-coder-6.7b-instruct",
  "microsoft/phi-3-mini",
  "01-ai/Yi-6B",

  // Vector Databases for RAG
  "weaviate/weaviate",
  "milvusdb/milvus",
  "qdrant/qdrant",
  "pinecone/pinecone-service",
  "supabase/postgres",

  // Supporting Services & Tools
  "redis",
  "redis/redis-stack",
  "postgres",
  "grafana/grafana",
  "prom/prometheus",
  "traefik",
  "minio/minio",

  // Additional Monitoring & Logging
  "jaegertracing/all-in-one",
  "fluent/fluentd",
  "openzipkin/zipkin",
  "elastic/elasticsearch",
  "kibana/kibana",

  // Orchestration and Workflow
  "portainer/portainer",
  "docker/compose",
  "apache/airflow",
  "kubeflow/pipelines-api",
  "dask/dask",

  // AI Security & Governance
  "intel/openvino-model-server",
  "seldon/seldon-core",
  "gradio/gradio",
  "mlflow/mlflow",
  "huggingface/hub",
];

export const command = defineCommand({
  meta: {
    description: "Pull Docker images for LLM stack",
    name: "pull-containers",
  },
  run: async () => {
    for (const image of IMAGES) {
      console.log(`Pulling image: ${image}`);
      try {
        await execCommand("docker", ["pull", image]);
      } catch {
        console.log(`Failed to pull image: ${image}`);
      }
    }
    console.log("All specified images have been processed.");
  },
});
