-- PREPARAÇÃO APENAS: não executado pelo agente.
-- Aplicar somente numa cópia local/de desenvolvimento identificada e com backup.
-- Não executar no banco remoto/produção nesta fase.
-- Conferir previamente SHOW COLUMNS FROM Post LIKE 'editorialUpdatedAt';
-- Se a coluna já existir, não repetir este ALTER.
-- DDL em MySQL/MariaDB pode fazer commit implícito; não tratar como rollback transacional.
ALTER TABLE `Post` ADD COLUMN `editorialUpdatedAt` DATETIME(3) NULL;
-- Sem UPDATE/backfill: os registros existentes permanecem NULL neste campo.
