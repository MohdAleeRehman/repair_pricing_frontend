export interface RepairResponse {
    final_summary: string;
}

export async function fetchRepairSummary(device: string, issue: string): Promise<RepairResponse> {
    const response = await fetch("http://127.0.0.1:9000/repair_assistance", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({device, issue}),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch repair summary");
    }

    const data = await response.json();
    return data.repair_process;
}