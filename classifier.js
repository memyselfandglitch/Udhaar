import dotenv from 'dotenv'
dotenv.config();
const API_TOKEN=process.env.API_TOKEN;

import fetch from "node-fetch";

async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
        {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json();
    return result;
}
query({inputs: "Netflix", parameters: {candidate_labels: ["food", "subscription", "travelling", "transportation","online shopping", "rent and utilities"]}}).then((response) => {
    console.log(`${response["sequence"]} has a type of ${response["labels"][0]} with probability ${response["scores"][0]}`)
});
