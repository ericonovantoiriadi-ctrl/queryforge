const OpenAI = require('openai');
let client;
function getClient() {
    if (!client) client = new OpenAI({ apiKey: process.env.MIMO_API_KEY || '', baseURL: process.env.MIMO_BASE_URL || 'https://api.mimo.xiaomi.com/v1' });
    return client;
}

async function analyzeQuery(sql, dialect) {
    const prompt = `Analyze this ${dialect} SQL query for optimization opportunities. Return JSON:
{
  "complexity": "low/medium/high",
  "issues": [{"type": "performance|correctness|security|style", "title": "...", "description": "...", "impact": "low|medium|high", "sql_suggestion": "improved SQL"}],
  "indexes": [{"table": "...", "columns": [...], "reason": "..."}],
  "explain_plan": {"estimated_cost": "...", "scan_type": "...", "notes": "..."},
  "summary": "one-line summary"
}

Query:
${sql}`;

    try {
        const resp = await getClient().chat.completions.create({
            model: process.env.MIMO_MODEL || 'MiMo-v2.5',
            messages: [
                { role: 'system', content: 'You are a database performance expert. Return valid JSON only.' },
                { role: 'user', content: prompt },
            ],
            temperature: 0.1, max_tokens: 2048,
        });
        let content = resp.choices[0].message.content || '{}';
        if (content.includes('```json')) content = content.split('```json')[1].split('```')[0];
        else if (content.includes('```')) content = content.split('```')[1].split('```')[0];
        const result = JSON.parse(content.trim());
        const tokens = (resp.usage?.prompt_tokens || 0) + (resp.usage?.completion_tokens || 0);
        return { result, tokens };
    } catch (e) {
        return { result: { complexity: 'unknown', issues: [], indexes: [], summary: e.message }, tokens: 0 };
    }
}

module.exports = { analyzeQuery };
