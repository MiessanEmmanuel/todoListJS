export async function fetchJSON(url){
    const data = await fetch(url)
    return data.json()
}