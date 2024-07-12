export function toJSON(data, status = 200) {
    let body = JSON.stringify(data, null, 2);
    let headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
        'content-type': 'application/json',
    };
    return new Response(body, { headers, status });
}
export function toError(error, status = 400) {
    return toJSON({ error }, status);
}
export function reply(output) {
    if (output != null)
        return toJSON(output, 200);
    return toError('Error with query', 500);
}
