import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Interceptor para enviar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//
// ================== Usuários ==================
//
export const getUsers = () => api.get("/users");
export const countUsers = () => api.get("/users/count");
export const getUserById = (id) => api.get(`/users/${id}`);
export const getUserByNametag = (nametag) => api.get(`/users/perfil/${nametag}`);
export const createUser = (data) => api.post("/users", data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const checkEmail = (email) =>
  api.get(`/users/check-email/${encodeURIComponent(email)}`);
export const checkNametag = (nametag) =>
  api.get(`/users/check-nametag/${encodeURIComponent(nametag)}`);

//
// ================== Autenticação ==================
//
export const login = (credentials) => api.post("/auth/login", credentials);

//
// ================== Atualizações de Tipo/Status ==================
//
export const updateUserType = (id, tipo) =>
  api.put(`/users/${id}/type`, { tipo });
export const updateUserStatus = (id, status) =>
  api.put(`/users/${id}/status`, { status });
export const updatePassword = (id, data) =>
  api.put(`/users/${id}/password`, data);

//
// ================== Desabafos ==================
//
export const getDesabafos = () => api.get("/desabafo");
export const countDesabafo = () => api.get("/desabafo/count/total");
export const countDesabafoPendente = () => api.get("/desabafo/count/pendentes");
export const getDesabafoById = (id) => api.get(`/desabafo/${id}`);
export const getDesabafosByUser = (userId) => api.get(`/desabafo/user/${userId}`);
export const createDesabafo = (data) => api.post("/desabafo", data);
export const updateDesabafo = (id, data) => api.put(`/desabafo/${id}`, data);
export const deleteDesabafo = (id) => api.delete(`/desabafo/${id}`);
export const switchStatusDesabafo = (id, status) =>
  api.patch(`/desabafo/${id}/status`, { status });

///
// ================== Interações ==================
//

// Curtidas
export const getLikesCount = (desabafoId) =>
  api.get(`/interacao/${desabafoId}/likes`);
export const checkUserLike = (desabafoId) =>
  api.get(`/interacao/${desabafoId}/liked`);
export const toggleLike = (desabafoId) =>
  api.post(`/interacao/${desabafoId}/toggle-like`);
export const createInteracao = (desabafoId, data) =>
  api.post(`/interacao/${desabafoId}`, data);
export const deleteInteracao = (id) => api.delete(`/interacao/${id}`);
export const switchStatusResposta = (id, status) =>
  api.put(`/interacao/${id}`, { status });

export const getInteracaoById = (id) => api.get(`/interacao/detalhes/${id}`);


export const getRespostasByUser = (userId) => api.get(`/interacao/respostas/user/${userId}`);
export const getCurtidasByUser = (userId) => api.get(`/interacao/curtidas/user/${userId}`);

// Comentários
export const getComentariosAtivos = (desabafoId) =>
  api.get(`/interacao/${desabafoId}/comentarios`);
export const getUserComentarios = (desabafoId) =>
  api.get(`/interacao/${desabafoId}/user/comentarios`);
export const switchStatus = (id, status) =>
  api.put(`/interacao/${id}`, { status });
export const updateComentario = (id, texto) =>
  api.put(`/interacao/comentarios/${id}`, { texto });


// 🔹 Novo endpoint global
export const getAllComentarios = () => api.get("/interacao/comentarios/all");


//
// ================== Humor ==================
//
export const getHumores = () => api.get("/humor");
export const getHumorById = (id) => api.get(`/humor/${id}`);
export const createHumor = (data) => api.post("/humor", data);
export const updateHumor = (id, data) => api.put(`/humor/${id}`, data);
export const deleteHumor = (id) => api.delete(`/humor/${id}`);
export const switchHumorStatus = (id, status) =>
  api.put(`/humor/${id}/status`, { status });

//
// ================== Registro de Humor ==================
//
export const createRegistroHumor = (data) => api.post("/registro/humor", data);
export const getRegistroHumorByUser = (userId) => api.get(`/registro/humor/user/${userId}`);
export const updateRegistroHumor = (id, data) => api.put(`/registro/humor/${id}`, data);
export const deleteRegistroHumor = (id) => api.delete(`/registro/humor/${id}`);


//
// ================== Denúncias ==================
//
export const getDenuncias = () => api.get("/denuncia");
export const getDenunciaById = (id) => api.get(`/denuncia/${id}`);
export const getDenunciaByUser = (id) => api.get(`/denuncia/user/${id}`);
export const createDenuncia = (data) => api.post("/denuncia", data);
export const updateDenuncia = (id, data) => api.put(`/denuncia/${id}`, data);
export const deleteDenuncia = (id) => api.delete(`/denuncia/${id}`);
export const switchDenunciaStatus = (id, status) =>
  api.put(`/denuncia/${id}/status`, { status });
export const countDenuncia = () => api.get("/denuncia/count/");


//
// ================== Switch Status Conteúdo ==================
//
export const switchStatusConteudo = (tipo, id, status) => {
  switch (tipo) {
    case "desabafo":
      // status válido: "aprovado" ou "negado"
      // CORRIGIDO: Uso de PATCH para atualização parcial (status)
      return api.patch(`/desabafo/${id}/status`, { status });

    case "resposta":
      // status válido: "ativo" ou "inativo"
      return api.put(`/interacao/${id}`, { status });

    case "perfil":
      // status válido: "ativo" ou "inativo"
      return api.put(`/perfil/${id}/status`, { status });

    default:
      console.warn(`Tipo de conteúdo desconhecido: ${tipo}`);
      return Promise.reject(new Error(`Tipo inválido: ${tipo}`));
  }
};



//
// ================== Punições ==================
//
export const getPunicoes = () => api.get("/punicao");
export const getPunicaoById = (id) => api.get(`/punicao/${id}`);
export const getPunicoesByUsuario = (userId) => api.get(`/punicao/usuario/${userId}`);
export const getPunicoesAtivasByUsuario = (userId) => api.get(`/punicao/usuario/${userId}/ativas`);
export const verificarPunicaoAtiva = (userId) => api.get(`/punicao/usuario/${userId}/verificar`);
// UNIFICADO: 'aplicarPunicao' foi removida e substituída por 'criarPunicao'
export const aplicarPunicao = (data) => api.post("/punicao", data);
export const atualizarPunicao = (id, data) => api.put(`/punicao/${id}`, data);
export const atualizarStatusPunicao = (id, status) => api.patch(`/punicao/${id}/status`, { status });
export const revogarPunicao = (id) => api.patch(`/punicao/${id}/revogar`);
export const deletarPunicao = (id) => api.delete(`/punicao/${id}`);
export const atualizarPunicoesExpiradas = () => api.patch(`/punicao/expiradas/atualizar`);

//
// ================== Conteúdo (Genérico) ==================
//
export const getConteudos = () => api.get("/conteudo");
export const getConteudoById = (id) => api.get(`/conteudo/${id}`);
export const createConteudo = (data) => api.post("/conteudo", data);
export const updateConteudo = (id, data) => api.put(`/conteudo/${id}`, data);
export const deleteConteudo = (id) => api.delete(`/conteudo/${id}`);


export default api;