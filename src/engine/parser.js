function parseSQL(sql) {
    const tables = [];
    const joins = [];
    const whereClauses = [];
    const upper = sql.toUpperCase();

    // Extract tables
    const fromMatch = sql.match(/FROM\s+([\w,\s]+)/i);
    if (fromMatch) fromMatch[1].split(',').forEach(t => tables.push(t.trim().split(/\s+/)[0]));

    // Extract JOINs
    const joinRegex = /JOIN\s+(\w+)/gi;
    let m;
    while ((m = joinRegex.exec(sql)) !== null) joins.push(m[1]);

    // Detect patterns
    const hasSelectStar = /SELECT\s+\*/.test(upper);
    const hasSubquery = sql.includes('(SELECT') || sql.includes('(select');
    const hasLike = /LIKE\s+'%/.test(upper);
    const hasNotIn = /NOT\s+IN/.test(upper);
    const hasOrderBy = /ORDER\s+BY/.test(upper);
    const hasGroupBy = /GROUP\s+BY/.test(upper);
    const hasDistinct = /DISTINCT/.test(upper);
    const hasOrInWhere = /WHERE.*\bOR\b/i.test(sql);

    return {
        tables, joins, whereClauses,
        patterns: { hasSelectStar, hasSubquery, hasLike, hasNotIn, hasOrderBy, hasGroupBy, hasDistinct, hasOrInWhere },
        lineCount: sql.split('\n').length,
    };
}

module.exports = { parseSQL };
