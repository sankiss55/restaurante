--
-- PostgreSQL database dump
--

\restrict BchtrMvp0IXPNtKAFyYDQaXT4ozVvajoiFbuOwHZEbMx3PW0ugyo5CKusXDg36s

-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)

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
-- Name: notificar_cambio_orden(); Type: FUNCTION; Schema: public; Owner: admin
--

CREATE FUNCTION public.notificar_cambio_orden() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  PERFORM pg_notify('orden_actualizada', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.notificar_cambio_orden() OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categoria_producto; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.categoria_producto (
    id integer NOT NULL,
    categoria character varying(225) NOT NULL,
    descripcion character varying(225)
);


ALTER TABLE public.categoria_producto OWNER TO admin;

--
-- Name: categoria_producto_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.categoria_producto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categoria_producto_id_seq OWNER TO admin;

--
-- Name: categoria_producto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.categoria_producto_id_seq OWNED BY public.categoria_producto.id;


--
-- Name: detalles_orden; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.detalles_orden (
    id integer NOT NULL,
    sub_total double precision NOT NULL,
    producto_cantidad integer NOT NULL,
    nota character varying(225),
    precio_unitario double precision NOT NULL,
    nombre_producto character varying(225) NOT NULL,
    id_producto integer,
    id_orden integer NOT NULL
);


ALTER TABLE public.detalles_orden OWNER TO admin;

--
-- Name: detalles_orden_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.detalles_orden_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalles_orden_id_seq OWNER TO admin;

--
-- Name: detalles_orden_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.detalles_orden_id_seq OWNED BY public.detalles_orden.id;


--
-- Name: estados_orden; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.estados_orden (
    id integer NOT NULL,
    estado character varying(225) NOT NULL,
    descripcion character varying(225)
);


ALTER TABLE public.estados_orden OWNER TO admin;

--
-- Name: estados_orden_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.estados_orden_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estados_orden_id_seq OWNER TO admin;

--
-- Name: estados_orden_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.estados_orden_id_seq OWNED BY public.estados_orden.id;


--
-- Name: mesas; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.mesas (
    id integer NOT NULL,
    numero_mesa integer NOT NULL,
    atendida boolean NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    id_usuario integer
);


ALTER TABLE public.mesas OWNER TO admin;

--
-- Name: mesas_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.mesas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mesas_id_seq OWNER TO admin;

--
-- Name: mesas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.mesas_id_seq OWNED BY public.mesas.id;


--
-- Name: orden; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.orden (
    id integer NOT NULL,
    nota character varying(225),
    total double precision NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    id_mesa integer NOT NULL,
    usuario_atencion integer NOT NULL,
    id_estado integer NOT NULL
);


ALTER TABLE public.orden OWNER TO admin;

--
-- Name: orden_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.orden_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orden_id_seq OWNER TO admin;

--
-- Name: orden_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.orden_id_seq OWNED BY public.orden.id;


--
-- Name: productos; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.productos (
    id integer NOT NULL,
    nombre character varying(225) NOT NULL,
    ingredientes text,
    precio double precision NOT NULL,
    imagen character varying(225) NOT NULL,
    disponibilidad boolean NOT NULL,
    creation_date timestamp with time zone,
    date_modification timestamp with time zone,
    id_categoria integer
);


ALTER TABLE public.productos OWNER TO admin;

--
-- Name: productos_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productos_id_seq OWNER TO admin;

--
-- Name: productos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.productos_id_seq OWNED BY public.productos.id;


--
-- Name: tipousuario; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.tipousuario (
    id integer NOT NULL,
    tipo character varying(225) NOT NULL,
    descripcion character varying(225)
);


ALTER TABLE public.tipousuario OWNER TO admin;

--
-- Name: tipousuario_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.tipousuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipousuario_id_seq OWNER TO admin;

--
-- Name: tipousuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.tipousuario_id_seq OWNED BY public.tipousuario.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(225) NOT NULL,
    password character varying(225) NOT NULL,
    correo character varying(225) NOT NULL,
    creation_date timestamp without time zone,
    date_modification timestamp without time zone,
    activo boolean DEFAULT true NOT NULL,
    id_tipo integer NOT NULL
);


ALTER TABLE public.usuarios OWNER TO admin;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO admin;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: categoria_producto id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.categoria_producto ALTER COLUMN id SET DEFAULT nextval('public.categoria_producto_id_seq'::regclass);


--
-- Name: detalles_orden id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.detalles_orden ALTER COLUMN id SET DEFAULT nextval('public.detalles_orden_id_seq'::regclass);


--
-- Name: estados_orden id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.estados_orden ALTER COLUMN id SET DEFAULT nextval('public.estados_orden_id_seq'::regclass);


--
-- Name: mesas id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.mesas ALTER COLUMN id SET DEFAULT nextval('public.mesas_id_seq'::regclass);


--
-- Name: orden id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.orden ALTER COLUMN id SET DEFAULT nextval('public.orden_id_seq'::regclass);


--
-- Name: productos id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.productos ALTER COLUMN id SET DEFAULT nextval('public.productos_id_seq'::regclass);


--
-- Name: tipousuario id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tipousuario ALTER COLUMN id SET DEFAULT nextval('public.tipousuario_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Name: productos PK_04f604609a0949a7f3b43400766; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT "PK_04f604609a0949a7f3b43400766" PRIMARY KEY (id);


--
-- Name: categoria_producto PK_0c5f3593b3052972f4d2dbbda7c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.categoria_producto
    ADD CONSTRAINT "PK_0c5f3593b3052972f4d2dbbda7c" PRIMARY KEY (id);


--
-- Name: detalles_orden PK_162ceff64f5d6896537ec86227e; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.detalles_orden
    ADD CONSTRAINT "PK_162ceff64f5d6896537ec86227e" PRIMARY KEY (id);


--
-- Name: orden PK_7dc2f9c066419f6f0782cafb454; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.orden
    ADD CONSTRAINT "PK_7dc2f9c066419f6f0782cafb454" PRIMARY KEY (id);


--
-- Name: estados_orden PK_b2628d3efdcddeff6ec7671260b; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.estados_orden
    ADD CONSTRAINT "PK_b2628d3efdcddeff6ec7671260b" PRIMARY KEY (id);


--
-- Name: tipousuario PK_b869fc608ccf7c0fe3878b60d9a; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tipousuario
    ADD CONSTRAINT "PK_b869fc608ccf7c0fe3878b60d9a" PRIMARY KEY (id);


--
-- Name: mesas PK_ccff054bd3dad6539869d03350c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.mesas
    ADD CONSTRAINT "PK_ccff054bd3dad6539869d03350c" PRIMARY KEY (id);


--
-- Name: usuarios PK_d7281c63c176e152e4c531594a8; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY (id);


--
-- Name: mesas UQ_4a94d479e8cbce7fc7c22fda270; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.mesas
    ADD CONSTRAINT "UQ_4a94d479e8cbce7fc7c22fda270" UNIQUE (numero_mesa);


--
-- Name: usuarios UQ_63665765c1a778a770c9bd585d3; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "UQ_63665765c1a778a770c9bd585d3" UNIQUE (correo);


--
-- Name: tipousuario UQ_815846ec782d97ee8dc97034a6a; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.tipousuario
    ADD CONSTRAINT "UQ_815846ec782d97ee8dc97034a6a" UNIQUE (tipo);


--
-- Name: categoria_producto UQ_e7a87cda865d3aab39256692ca0; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.categoria_producto
    ADD CONSTRAINT "UQ_e7a87cda865d3aab39256692ca0" UNIQUE (categoria);


--
-- Name: estados_orden UQ_efdef06399da8450a1fb30bfbe7; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.estados_orden
    ADD CONSTRAINT "UQ_efdef06399da8450a1fb30bfbe7" UNIQUE (estado);


--
-- Name: orden trigger_orden_estado; Type: TRIGGER; Schema: public; Owner: admin
--

CREATE TRIGGER trigger_orden_estado AFTER UPDATE ON public.orden FOR EACH ROW EXECUTE FUNCTION public.notificar_cambio_orden();


--
-- Name: orden FK_303b05dfa4a77a19704d530ef54; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.orden
    ADD CONSTRAINT "FK_303b05dfa4a77a19704d530ef54" FOREIGN KEY (id_estado) REFERENCES public.estados_orden(id);


--
-- Name: usuarios FK_5527afb9b9cc513cc67bbd9f16c; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT "FK_5527afb9b9cc513cc67bbd9f16c" FOREIGN KEY (id_tipo) REFERENCES public.tipousuario(id);


--
-- Name: productos FK_67e14062fdfd39fba436bccaff3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT "FK_67e14062fdfd39fba436bccaff3" FOREIGN KEY (id_categoria) REFERENCES public.categoria_producto(id);


--
-- Name: orden FK_683d2ff09956d351c7b0439c004; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.orden
    ADD CONSTRAINT "FK_683d2ff09956d351c7b0439c004" FOREIGN KEY (id_mesa) REFERENCES public.mesas(id);


--
-- Name: detalles_orden FK_751008261fff5f28e1486cc6742; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.detalles_orden
    ADD CONSTRAINT "FK_751008261fff5f28e1486cc6742" FOREIGN KEY (id_orden) REFERENCES public.orden(id);


--
-- Name: mesas FK_9466e735f318c1808acc17a9cbe; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.mesas
    ADD CONSTRAINT "FK_9466e735f318c1808acc17a9cbe" FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- Name: orden FK_ae8c839fde394f6747e040906ed; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.orden
    ADD CONSTRAINT "FK_ae8c839fde394f6747e040906ed" FOREIGN KEY (usuario_atencion) REFERENCES public.usuarios(id);


--
-- Name: detalles_orden FK_b04d12e154c08342426af5cd0c0; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.detalles_orden
    ADD CONSTRAINT "FK_b04d12e154c08342426af5cd0c0" FOREIGN KEY (id_producto) REFERENCES public.productos(id);


--
-- PostgreSQL database dump complete
--

\unrestrict BchtrMvp0IXPNtKAFyYDQaXT4ozVvajoiFbuOwHZEbMx3PW0ugyo5CKusXDg36s

