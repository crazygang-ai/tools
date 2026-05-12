import { CheatsheetTable } from './CheatsheetTable';

const sections = [
  {
    key: 'ddl',
    rows: [
      { cmd: 'CREATE TABLE t (id INT PRIMARY KEY, name TEXT);', zh: '建表', en: 'Create table' },
      { cmd: 'ALTER TABLE t ADD COLUMN c INT;', zh: '加列', en: 'Add column' },
      { cmd: 'ALTER TABLE t DROP COLUMN c;', zh: '删列', en: 'Drop column' },
      { cmd: 'CREATE INDEX idx_t_name ON t(name);', zh: '建索引', en: 'Create index' },
      { cmd: 'DROP TABLE t;', zh: '删表', en: 'Drop table' },
    ],
  },
  {
    key: 'dml',
    rows: [
      { cmd: 'INSERT INTO t (id, name) VALUES (1, \'a\');', zh: '插入', en: 'Insert row' },
      { cmd: 'UPDATE t SET name = \'b\' WHERE id = 1;', zh: '更新', en: 'Update rows' },
      { cmd: 'DELETE FROM t WHERE id = 1;', zh: '删除', en: 'Delete rows' },
      { cmd: 'TRUNCATE TABLE t;', zh: '清空表', en: 'Truncate table' },
      { cmd: 'INSERT ... ON CONFLICT (id) DO UPDATE ...', zh: 'Upsert (Postgres)', en: 'Upsert (Postgres)' },
    ],
  },
  {
    key: 'query',
    rows: [
      { cmd: 'SELECT * FROM t WHERE id = 1;', zh: '基础查询', en: 'Basic query' },
      { cmd: 'SELECT col FROM t ORDER BY col DESC LIMIT 10;', zh: '排序与分页', en: 'Order & limit' },
      { cmd: 'SELECT DISTINCT col FROM t;', zh: '去重', en: 'Distinct values' },
      { cmd: 'SELECT * FROM t WHERE name LIKE \'a%\';', zh: '模糊查询', en: 'LIKE pattern match' },
      { cmd: 'SELECT * FROM t WHERE col IN (1,2,3);', zh: 'IN 列表', en: 'IN list' },
    ],
  },
  {
    key: 'join',
    rows: [
      { cmd: 'SELECT * FROM a INNER JOIN b ON a.id = b.aid;', zh: '内连接', en: 'Inner join' },
      { cmd: 'SELECT * FROM a LEFT JOIN b ON a.id = b.aid;', zh: '左连接', en: 'Left outer join' },
      { cmd: 'SELECT * FROM a RIGHT JOIN b ON a.id = b.aid;', zh: '右连接', en: 'Right outer join' },
      { cmd: 'SELECT * FROM a FULL OUTER JOIN b ON a.id = b.aid;', zh: '全连接', en: 'Full outer join' },
      { cmd: 'SELECT * FROM a CROSS JOIN b;', zh: '笛卡尔积', en: 'Cartesian product' },
    ],
  },
  {
    key: 'agg',
    rows: [
      { cmd: 'SELECT cat, COUNT(*) FROM t GROUP BY cat;', zh: '分组计数', en: 'Group + count' },
      { cmd: 'SELECT cat, SUM(amt) FROM t GROUP BY cat HAVING SUM(amt) > 100;', zh: 'HAVING 筛选', en: 'HAVING filter' },
      { cmd: 'SELECT *, ROW_NUMBER() OVER (PARTITION BY cat ORDER BY id) FROM t;', zh: '窗口函数', en: 'Window function' },
      { cmd: 'WITH t2 AS (SELECT ... ) SELECT * FROM t2;', zh: 'CTE 公共表表达式', en: 'CTE / WITH clause' },
    ],
  },
];

export default function SqlCheatsheet() {
  return <CheatsheetTable ns="sql-cheatsheet" sections={sections} />;
}
