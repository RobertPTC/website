--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.7 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: _heroku; Type: SCHEMA; Schema: -; Owner: heroku_admin
--

CREATE SCHEMA _heroku;


ALTER SCHEMA _heroku OWNER TO heroku_admin;

--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: create_ext(); Type: FUNCTION; Schema: _heroku; Owner: heroku_admin
--

CREATE FUNCTION _heroku.create_ext() RETURNS event_trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$

DECLARE

  schemaname TEXT;
  databaseowner TEXT;

  r RECORD;

BEGIN

  IF tg_tag = 'CREATE EXTENSION' and current_user != 'rds_superuser' THEN
    FOR r IN SELECT * FROM pg_event_trigger_ddl_commands()
    LOOP
        CONTINUE WHEN r.command_tag != 'CREATE EXTENSION' OR r.object_type != 'extension';

        schemaname = (
            SELECT n.nspname
            FROM pg_catalog.pg_extension AS e
            INNER JOIN pg_catalog.pg_namespace AS n
            ON e.extnamespace = n.oid
            WHERE e.oid = r.objid
        );

        databaseowner = (
            SELECT pg_catalog.pg_get_userbyid(d.datdba)
            FROM pg_catalog.pg_database d
            WHERE d.datname = current_database()
        );
        --RAISE NOTICE 'Record for event trigger %, objid: %,tag: %, current_user: %, schema: %, database_owenr: %', r.object_identity, r.objid, tg_tag, current_user, schemaname, databaseowner;
        IF r.object_identity = 'address_standardizer_data_us' THEN
            EXECUTE format('GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE %I.us_gaz TO %I;', schemaname, databaseowner);
            EXECUTE format('GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE %I.us_lex TO %I;', schemaname, databaseowner);
            EXECUTE format('GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE %I.us_rules TO %I;', schemaname, databaseowner);
        ELSIF r.object_identity = 'amcheck' THEN
            EXECUTE format('GRANT EXECUTE ON FUNCTION %I.bt_index_check TO %I;', schemaname, databaseowner);
            EXECUTE format('GRANT EXECUTE ON FUNCTION %I.bt_index_parent_check TO %I;', schemaname, databaseowner);
        ELSIF r.object_identity = 'dict_int' THEN
            EXECUTE format('ALTER TEXT SEARCH DICTIONARY %I.intdict OWNER TO %I;', schemaname, databaseowner);
        ELSIF r.object_identity = 'pg_partman' THEN
            EXECUTE format('GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE %I.part_config TO %I;', schemaname, databaseowner);
            EXECUTE format('GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE %I.part_config_sub TO %I;', schemaname, databaseowner);
            EXECUTE format('GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE %I.custom_time_partitions TO %I;', schemaname, databaseowner);
        ELSIF r.object_identity = 'pg_stat_statements' THEN
            EXECUTE format('GRANT EXECUTE ON FUNCTION %I.pg_stat_statements_reset TO %I;', schemaname, databaseowner);
        ELSIF r.object_identity = 'postgis' THEN
            PERFORM _heroku.postgis_after_create();
        ELSIF r.object_identity = 'postgis_raster' THEN
            PERFORM _heroku.postgis_after_create();
            EXECUTE format('GRANT SELECT ON TABLE %I.raster_columns TO %I;', schemaname, databaseowner);
            EXECUTE format('GRANT SELECT ON TABLE %I.raster_overviews TO %I;', schemaname, databaseowner);
        ELSIF r.object_identity = 'postgis_topology' THEN
            PERFORM _heroku.postgis_after_create();
            EXECUTE format('GRANT USAGE ON SCHEMA topology TO %I;', databaseowner);
            EXECUTE format('GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA topology TO %I;', databaseowner);
            EXECUTE format('GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA topology TO %I;', databaseowner);
            EXECUTE format('GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA topology TO %I;', databaseowner);
        ELSIF r.object_identity = 'postgis_tiger_geocoder' THEN
            PERFORM _heroku.postgis_after_create();
            EXECUTE format('GRANT USAGE ON SCHEMA tiger TO %I;', databaseowner);
            EXECUTE format('GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA tiger TO %I;', databaseowner);
            EXECUTE format('GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA tiger TO %I;', databaseowner);

            EXECUTE format('GRANT USAGE ON SCHEMA tiger_data TO %I;', databaseowner);
            EXECUTE format('GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA tiger_data TO %I;', databaseowner);
            EXECUTE format('GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA tiger_data TO %I;', databaseowner);
        END IF;
    END LOOP;
  END IF;
END;
$$;


ALTER FUNCTION _heroku.create_ext() OWNER TO heroku_admin;

--
-- Name: drop_ext(); Type: FUNCTION; Schema: _heroku; Owner: heroku_admin
--

CREATE FUNCTION _heroku.drop_ext() RETURNS event_trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$

DECLARE

  schemaname TEXT;
  databaseowner TEXT;

  r RECORD;

BEGIN

  IF tg_tag = 'DROP EXTENSION' and current_user != 'rds_superuser' THEN
    FOR r IN SELECT * FROM pg_event_trigger_dropped_objects()
    LOOP
      CONTINUE WHEN r.object_type != 'extension';

      databaseowner = (
            SELECT pg_catalog.pg_get_userbyid(d.datdba)
            FROM pg_catalog.pg_database d
            WHERE d.datname = current_database()
      );

      --RAISE NOTICE 'Record for event trigger %, objid: %,tag: %, current_user: %, database_owner: %, schemaname: %', r.object_identity, r.objid, tg_tag, current_user, databaseowner, r.schema_name;

      IF r.object_identity = 'postgis_topology' THEN
          EXECUTE format('DROP SCHEMA IF EXISTS topology');
      END IF;
    END LOOP;

  END IF;
END;
$$;


ALTER FUNCTION _heroku.drop_ext() OWNER TO heroku_admin;

--
-- Name: postgis_after_create(); Type: FUNCTION; Schema: _heroku; Owner: heroku_admin
--

CREATE FUNCTION _heroku.postgis_after_create() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    schemaname TEXT;
    databaseowner TEXT;
BEGIN
    schemaname = (
        SELECT n.nspname
        FROM pg_catalog.pg_extension AS e
        INNER JOIN pg_catalog.pg_namespace AS n ON e.extnamespace = n.oid
        WHERE e.extname = 'postgis'
    );
    databaseowner = (
        SELECT pg_catalog.pg_get_userbyid(d.datdba)
        FROM pg_catalog.pg_database d
        WHERE d.datname = current_database()
    );

    EXECUTE format('GRANT EXECUTE ON FUNCTION %I.st_tileenvelope TO %I;', schemaname, databaseowner);
    EXECUTE format('GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE %I.spatial_ref_sys TO %I;', schemaname, databaseowner);
END;
$$;


ALTER FUNCTION _heroku.postgis_after_create() OWNER TO heroku_admin;

--
-- Name: validate_extension(); Type: FUNCTION; Schema: _heroku; Owner: heroku_admin
--

CREATE FUNCTION _heroku.validate_extension() RETURNS event_trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$

DECLARE

  schemaname TEXT;
  r RECORD;

BEGIN

  IF tg_tag = 'CREATE EXTENSION' and current_user != 'rds_superuser' THEN
    FOR r IN SELECT * FROM pg_event_trigger_ddl_commands()
    LOOP
      CONTINUE WHEN r.command_tag != 'CREATE EXTENSION' OR r.object_type != 'extension';

      schemaname = (
        SELECT n.nspname
        FROM pg_catalog.pg_extension AS e
        INNER JOIN pg_catalog.pg_namespace AS n
        ON e.extnamespace = n.oid
        WHERE e.oid = r.objid
      );

      IF schemaname = '_heroku' THEN
        RAISE EXCEPTION 'Creating extensions in the _heroku schema is not allowed';
      END IF;
    END LOOP;
  END IF;
END;
$$;


ALTER FUNCTION _heroku.validate_extension() OWNER TO heroku_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: journalist; Type: TABLE; Schema: public; Owner: u95b1jdl3p0a8f
--

CREATE TABLE public.journalist (
    journalist_id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    email text NOT NULL
);


ALTER TABLE public.journalist OWNER TO u95b1jdl3p0a8f;

--
-- Name: moment; Type: TABLE; Schema: public; Owner: u95b1jdl3p0a8f
--

CREATE TABLE public.moment (
    moment_id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    date_string text NOT NULL,
    moment text NOT NULL,
    journalist_id uuid NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    date integer NOT NULL,
    score numeric DEFAULT 0 NOT NULL
);


ALTER TABLE public.moment OWNER TO u95b1jdl3p0a8f;

--
-- Data for Name: journalist; Type: TABLE DATA; Schema: public; Owner: u95b1jdl3p0a8f
--

COPY public.journalist (journalist_id, created_at, email) FROM stdin;
c3e3bc64-e05e-439a-9159-24f8bf06bd3a	2024-04-26 00:39:04.140748+00	rptc3000@gmail.com
\.


--
-- Data for Name: moment; Type: TABLE DATA; Schema: public; Owner: u95b1jdl3p0a8f
--

COPY public.moment (moment_id, created_at, date_string, moment, journalist_id, month, year, date, score) FROM stdin;
de3159bb-81b4-410d-bf45-1c7a3d1f1922	2024-04-26 20:12:52.503062+00	4/26/2024	test moment	c3e3bc64-e05e-439a-9159-24f8bf06bd3a	3	2024	26	0
49064e51-a3cf-490f-96ce-508ccd41c502	2024-04-26 20:13:10.027076+00	4/26/2024	test moment 2	c3e3bc64-e05e-439a-9159-24f8bf06bd3a	3	2024	26	0
ba522061-35a0-4659-9b5a-378d6360f51f	2024-05-01 16:07:11.233641+00	5/1/2024	i love this moment in which i decide to love God with all my fiber.	c3e3bc64-e05e-439a-9159-24f8bf06bd3a	4	2024	1	0.4666666666666667
\.


--
-- Name: journalist journalist_pkey; Type: CONSTRAINT; Schema: public; Owner: u95b1jdl3p0a8f
--

ALTER TABLE ONLY public.journalist
    ADD CONSTRAINT journalist_pkey PRIMARY KEY (journalist_id);


--
-- Name: moment moment_pkey; Type: CONSTRAINT; Schema: public; Owner: u95b1jdl3p0a8f
--

ALTER TABLE ONLY public.moment
    ADD CONSTRAINT moment_pkey PRIMARY KEY (moment_id);


--
-- Name: moment moment_journalist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: u95b1jdl3p0a8f
--

ALTER TABLE ONLY public.moment
    ADD CONSTRAINT moment_journalist_id_fkey FOREIGN KEY (journalist_id) REFERENCES public.journalist(journalist_id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO u95b1jdl3p0a8f;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint); Type: ACL; Schema: public; Owner: rdsadmin
--

GRANT ALL ON FUNCTION public.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO u95b1jdl3p0a8f;


--
-- Name: log_create_ext; Type: EVENT TRIGGER; Schema: -; Owner: heroku_admin
--

CREATE EVENT TRIGGER log_create_ext ON ddl_command_end
   EXECUTE FUNCTION _heroku.create_ext();


ALTER EVENT TRIGGER log_create_ext OWNER TO heroku_admin;

--
-- Name: log_drop_ext; Type: EVENT TRIGGER; Schema: -; Owner: heroku_admin
--

CREATE EVENT TRIGGER log_drop_ext ON sql_drop
   EXECUTE FUNCTION _heroku.drop_ext();


ALTER EVENT TRIGGER log_drop_ext OWNER TO heroku_admin;

--
-- Name: validate_extension; Type: EVENT TRIGGER; Schema: -; Owner: heroku_admin
--

CREATE EVENT TRIGGER validate_extension ON ddl_command_end
   EXECUTE FUNCTION _heroku.validate_extension();


ALTER EVENT TRIGGER validate_extension OWNER TO heroku_admin;

--
-- PostgreSQL database dump complete
--

