SET local check_function_bodies = off;

CREATE TABLE "public"."alarms" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "machine_id"  uuid                     NOT NULL,
  "alarm_code"  text                     NOT NULL,
  "description" text,
  "occurred_at" timestamp with time zone NOT NULL DEFAULT now(),
  "cause"       text,
  "status"      text                     NOT NULL DEFAULT 'Open'::text,
  CONSTRAINT "alarms_pkey" PRIMARY KEY (id),
  CONSTRAINT "alarms_status_check" CHECK ((status = ANY (ARRAY['Open'::text, 'In Progress'::text, 'Closed'::text])))
);

ALTER TABLE "public"."alarms"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."machines" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "machine_id" text                     NOT NULL,
  "name"       text                     NOT NULL,
  "type"       text                     NOT NULL,
  "location"   text                     NOT NULL,
  "status"     text                     NOT NULL DEFAULT 'Stop'::text,
  "created_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "machines_machine_id_key" UNIQUE (machine_id),
  CONSTRAINT "machines_pkey" PRIMARY KEY (id),
  CONSTRAINT "machines_status_check" CHECK ((status = ANY (ARRAY['Running'::text, 'Stopped'::text, 'Alarm'::text, 'Maintenance'::text])))
);

ALTER TABLE "public"."machines"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."maintenance_records" (
  "id"            uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "machine_id"    uuid                     NOT NULL,
  "technician_id" uuid,
  "description"   text                     NOT NULL,
  "maintained_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "maintenance_records_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."maintenance_records"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
  "id"        uuid NOT NULL,
  "full_name" text,
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

CREATE TYPE "public"."user_role" AS ENUM (
  'admin',
  'technician'
);

ALTER TABLE "public"."profiles"
  ADD COLUMN "role" public.user_role NOT NULL DEFAULT 'technician'::public.user_role;

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end $function$;

CREATE OR REPLACE FUNCTION public.is_admin()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO 'public'
  AS $function$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$function$;

ALTER TABLE "public"."alarms"
  ADD CONSTRAINT "alarms_machine_id_fkey" FOREIGN KEY (machine_id) REFERENCES public.machines(id) ON DELETE CASCADE;

ALTER TABLE "public"."maintenance_records"
  ADD CONSTRAINT "maintenance_records_machine_id_fkey" FOREIGN KEY (machine_id) REFERENCES public.machines(id) ON DELETE CASCADE;

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE "public"."maintenance_records"
  ADD CONSTRAINT "maintenance_records_technician_id_fkey" FOREIGN KEY (technician_id) REFERENCES public.profiles(id);

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "admin delete alarms" ON "public"."alarms"
  FOR DELETE
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "admin insert alarms" ON "public"."alarms"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.is_admin());

CREATE POLICY "read alarms" ON "public"."alarms"
  FOR SELECT
  TO "authenticated"
  USING (true);

CREATE POLICY "update alarms" ON "public"."alarms"
  FOR UPDATE
  TO "authenticated"
  USING (true);

CREATE POLICY "admin write machines" ON "public"."machines"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "read machines" ON "public"."machines"
  FOR SELECT
  TO "authenticated"
  USING (true);

CREATE POLICY "admin delete mr" ON "public"."maintenance_records"
  FOR DELETE
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "insert mr" ON "public"."maintenance_records"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (true);

CREATE POLICY "read mr" ON "public"."maintenance_records"
  FOR SELECT
  TO "authenticated"
  USING (true);

CREATE POLICY "update mr" ON "public"."maintenance_records"
  FOR UPDATE
  TO "authenticated"
  USING (true);

CREATE POLICY "admin manage profiles" ON "public"."profiles"
  FOR ALL
  TO "authenticated"
  USING (public.is_admin());

CREATE POLICY "read own profile" ON "public"."profiles"
  FOR SELECT
  TO "authenticated"
  USING (((id = auth.uid()) OR public.is_admin()));

GRANT EXECUTE ON FUNCTION "public"."handle_new_user"() TO PUBLIC, "anon", "authenticated", "postgres", "service_role";

GRANT EXECUTE ON FUNCTION "public"."is_admin"() TO PUBLIC, "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."alarms" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."machines" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."maintenance_records" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "anon", "authenticated", "postgres", "service_role";

GRANT USAGE ON TYPE "public"."user_role" TO "postgres";

