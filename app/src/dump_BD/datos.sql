--
-- PostgreSQL database dump
--

\restrict 0jUolRqVvAAIO0X0qphjrRqHxCMk5xNm9nEqwPIrmA0p0w4eVeWCauliFN5n9GA

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
-- Data for Name: categoria_producto; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.categoria_producto (id, categoria, descripcion) FROM stdin;
1	Pizzas	Pizzas variadas
2	Pastas	Pastas frescas
3	Bebidas	Bebidas varias
\.


--
-- Data for Name: estados_orden; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.estados_orden (id, estado, descripcion) FROM stdin;
1	Pendiente	Orden creada, esperando
2	Preparando	En preparación en cocina
3	Listo	Listo para servir
4	Cancelado	Orden cancelada
5	Pagado	Orden pagada
\.


--
-- Data for Name: tipousuario; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.tipousuario (id, tipo, descripcion) FROM stdin;
1	Admin	\N
2	Cocinero	\N
3	Mesero	\N
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.usuarios (id, nombre, password, correo, creation_date, date_modification, activo, id_tipo) FROM stdin;
3	Santiago	$2b$10$.O0UTHvCb5ci05r9EgrPjef0hXdG21KYbxh7sC23KusWlEkCYbc5O	santiago@gmail.com	2026-06-06 19:23:42.598	2026-06-06 19:23:42.598	t	1
4	dsds	$2b$10$eDdhg8Ct6nKbTCHJqCsN/.lJrcDnu5rlfWep2eojxsDXAl.DMe4Ue	mesero@gmail.com	2026-06-06 19:26:16.3	2026-06-06 19:26:16.3	t	2
5	dnkdnsk	$2b$10$xmDA7l.l1YHVKAF5/lcqEeRQv23FdTSg2K7FadVEHqVGnvkqqEWMy	cocinero@gmail.com	2026-06-06 19:26:46.606	2026-06-06 19:26:46.606	t	3
6	Santiago	$2b$10$1eV6U.eUpLghVvODdoYI7umGXeeX1RRXoGveowwiUn4edq0ynzVI2	mesero2@gmail.com	2026-06-07 01:42:12.522	2026-06-07 01:42:12.522	t	1
7	Santiago	$2b$10$RlG.8RmczyKfhFyOYzyKWOhO6JE1zRWd3Ty08xuWuyYNXWNumBhEW	meseroo@gmail.com	2026-06-07 01:42:26.644	2026-06-07 01:42:26.644	t	3
\.


--
-- Data for Name: mesas; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.mesas (id, numero_mesa, atendida, activo, id_usuario) FROM stdin;
4	4	f	t	\N
9	7	f	f	\N
1	1	f	t	5
3	3	f	t	5
2	2	f	t	5
\.


--
-- Data for Name: orden; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.orden (id, nota, total, created_at, updated_at, id_mesa, usuario_atencion, id_estado) FROM stdin;
8		7.5	2026-06-07 01:19:19.658	2026-06-07 01:37:30.981	2	5	5
9		2958	2026-06-07 01:38:58.382	2026-06-07 01:39:06.281	1	5	5
2		87876	2026-06-07 00:26:09.286	2026-06-07 01:39:32.142	4	5	5
4		25.98	2026-06-07 00:44:40.411	2026-06-07 01:39:32.821	4	5	5
5		25.98	2026-06-07 00:48:22.903	2026-06-07 01:39:33.17	4	5	5
7		51.96	2026-06-07 01:08:37.833	2026-06-07 01:39:41.211	3	5	5
6		64.46000000000001	2026-06-07 00:54:17.26	2026-06-07 01:39:51.498	4	5	5
11		29.97	2026-06-07 03:40:38.439	2026-06-07 03:40:38.439	2	5	5
3		29.97	2026-06-07 00:44:18.887	2026-06-07 03:45:53.609	3	5	5
1		7.5	2026-06-07 00:25:44.742	2026-06-07 03:45:59.796	4	5	5
10		131814	2026-06-07 01:39:19.211	2026-06-07 03:46:06.419	3	5	5
12		2958	2026-06-07 04:09:26.903	2026-06-07 04:10:04.486	3	5	5
13		1972	2026-06-07 04:10:23.914	2026-06-07 04:11:29.35	1	5	5
15		19.98	2026-06-07 04:12:50.321	2026-06-07 04:18:19.826	3	5	5
14		1972	2026-06-07 04:12:21.016	2026-06-07 04:18:23.054	2	5	5
16		19.98	2026-06-07 04:18:01.462	2026-06-07 04:18:41.635	1	5	5
17		19.98	2026-06-07 04:18:48.479	2026-06-07 04:19:51.443	3	5	5
18		867	2026-06-07 05:18:29.387	2026-06-07 05:19:54.583	2	5	5
\.


--
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.productos (id, nombre, ingredientes, precio, imagen, disponibilidad, creation_date, date_modification, id_categoria) FROM stdin;
2	Pasta Carbonara	Pasta, huevo, jamón, queso	12.99	/images/pasta.jpg	t	2026-06-06 19:22:21.170016+00	\N	2
4	Pizza Margherita	Tomate, queso, albahaca	9.99	/images/pizza.jpg	t	2026-06-06 19:22:59.805372+00	\N	1
5	Pasta Carbonara	Pasta, huevo, jamón, queso	12.99	/images/pasta.jpg	t	2026-06-06 19:22:59.808938+00	\N	2
6	Coca Cola	Bebida gaseosa	2.5	/images/cocacola.jpg	t	2026-06-06 19:22:59.81187+00	\N	3
8	dsk	djsj	289	/images/productos/producto_1780774908737.jpg	t	2026-06-06 19:42:18.288+00	2026-06-06 19:42:18.288+00	1
7	kjdks	dsnk	3827	/images/productos/producto_1780776578104.jpg	t	2026-06-06 19:41:31.73+00	2026-06-06 20:10:07.899+00	2
9	prueba	d	43938	/uploads/productos/producto_1780778677304.jpg	t	2026-06-06 20:44:37.373+00	2026-06-06 20:44:37.373+00	2
1	Pizza Margherita	Tomate, queso, albahaca	986	/images/pizza.jpg	t	2026-06-06 19:22:21.168356+00	2026-06-06 23:54:35.957+00	1
3	Coca Cola	Bebida gaseosa	2.5	/uploads/productos/producto_1780790117247.jpg	t	2026-06-06 19:22:21.171053+00	2026-06-06 23:55:17.497+00	3
\.


--
-- Data for Name: detalles_orden; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.detalles_orden (id, sub_total, producto_cantidad, nota, precio_unitario, nombre_producto, id_producto, id_orden) FROM stdin;
1	7.5	3		2.5	Coca Cola	3	1
2	87876	2		43938	prueba	9	2
3	29.97	3		9.99	Pizza Margherita	4	3
4	25.98	2		12.99	Pasta Carbonara	5	4
5	25.98	2		12.99	Pasta Carbonara	5	5
6	51.96	4		12.99	Pasta Carbonara	5	6
7	12.5	5		2.5	Coca Cola	6	6
8	51.96	4		12.99	Pasta Carbonara	2	7
9	7.5	3		2.5	Coca Cola	6	8
10	2958	3		986	Pizza Margherita	1	9
11	131814	3		43938	prueba	9	10
12	29.97	3		9.99	Pizza Margherita	4	11
13	2958	3		986	Pizza Margherita	1	12
14	1972	2		986	Pizza Margherita	1	13
15	1972	2		986	Pizza Margherita	1	14
16	19.98	2		9.99	Pizza Margherita	4	15
17	19.98	2		9.99	Pizza Margherita	4	16
18	19.98	2		9.99	Pizza Margherita	4	17
19	867	3		289	dsk	8	18
\.


--
-- Name: categoria_producto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.categoria_producto_id_seq', 7, true);


--
-- Name: detalles_orden_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.detalles_orden_id_seq', 19, true);


--
-- Name: estados_orden_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.estados_orden_id_seq', 4, true);


--
-- Name: mesas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.mesas_id_seq', 9, true);


--
-- Name: orden_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.orden_id_seq', 18, true);


--
-- Name: productos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.productos_id_seq', 9, true);


--
-- Name: tipousuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.tipousuario_id_seq', 6, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 7, true);


--
-- PostgreSQL database dump complete
--

\unrestrict 0jUolRqVvAAIO0X0qphjrRqHxCMk5xNm9nEqwPIrmA0p0w4eVeWCauliFN5n9GA

