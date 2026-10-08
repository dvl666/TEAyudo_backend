-- Ejecutar antes de iniciar la aplicación con synchronize: true.
BEGIN;

-- Eliminar únicamente las claves foráneas de pictogram.infantId.
DO $$
DECLARE constraint_name text;
BEGIN
  FOR constraint_name IN
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
    WHERE c.conrelid = 'pictogram'::regclass
      AND c.contype = 'f' AND a.attname = 'infantId'
  LOOP
    EXECUTE format('ALTER TABLE pictogram DROP CONSTRAINT %I', constraint_name);
  END LOOP;
END $$;

ALTER TABLE pictogram ALTER COLUMN "infantId" DROP DEFAULT;
ALTER TABLE pictogram ALTER COLUMN "infantId" TYPE uuid[]
  USING CASE WHEN "infantId" IS NULL THEN '{}'::uuid[] ELSE ARRAY["infantId"] END;
ALTER TABLE pictogram ALTER COLUMN "infantId" SET DEFAULT '{}'::uuid[];
ALTER TABLE pictogram ALTER COLUMN "infantId" SET NOT NULL;

COMMIT;
