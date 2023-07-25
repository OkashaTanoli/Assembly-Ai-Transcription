// replace with your API token
const YOUR_API_TOKEN = "API_TOKEN"

// URL of the file to transcribe
const FILE_URL = "file_url"

// AssemblyAI transcript endpoint (where we submit the file)
const transcript_endpoint = "https://api.assemblyai.com/v2/transcript"

// request parameters where Summarization has been enabled
const data = {
    audio_url: FILE_URL,
    summarization: true,
    summary_model: 'informative',
    summary_type: 'bullets'
}

// HTTP request headers
const headers = {
    "Authorization": YOUR_API_TOKEN,
    "Content-Type": "application/json"
}

async function callApi() {


    // submit for transcription via HTTP request
    const response = await fetch(transcript_endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    });
    const res = await response.json()
    console.log(res)
    const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${res.id}`

    while (true) {
        const response = await fetch(pollingEndpoint, {
            method: 'GET',
            headers: headers
        });
        const transcriptionResult = await response.json()
        // console.log(pollingResponse)
        // const transcriptionResult = pollingResponse.data

        if (transcriptionResult.status === 'completed') {
            // print the results
            console.log(transcriptionResult)
            break
        } else if (transcriptionResult.status === 'error') {
            throw new Error(`Transcription failed: ${transcriptionResult.error}`)
        } else {
            await new Promise((resolve) => setTimeout(resolve, 3000))
        }
    }


}


callApi()
// polling for transcription completion