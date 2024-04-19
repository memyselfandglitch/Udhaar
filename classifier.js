import env from './.env.js';
import axios from "axios";

const API_TOKEN=env.API_TOKEN;

export async function classifier(data) {
    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
            data,
            {
                headers: { Authorization: `Bearer ${API_TOKEN}` },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(`HTTP request failed: ${error.message}`);
    }
}

    


// query({inputs: "dress", parameters: {candidate_labels: ["food", "subscription", "travelling", "transportation","online shopping", "rent and utilities","personal care","luxuries","miscellaneous"]}}).then((response) => {
//     console.log(`${response["sequence"]} has a type of ${response["labels"][0]} with probability ${response["scores"][0]}`)
// });

// export async function classifier(data) {
//     const response = await fetch(
//         "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
//         {
//             headers: { Authorization: `Bearer ${API_TOKEN}` },
//             method: "POST",
//             body: JSON.stringify(data),
//         }
//     );
//     const result = await response.json();
//     return result;
// }