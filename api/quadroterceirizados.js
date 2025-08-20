// api/dados.js

// URL da sua API original do Google App Script
const GOOGLE_API_URL =
  'https://script.googleusercontent.com/a/macros/pbh.gov.br/echo?user_content_key=AehSKLhXWNSj0F6hHvY4axSlEqN0Pm8dhGoNjBa8NxCouLkeLMZ1dwD3Talf-kikaplpqmFbeh_-Qn4L1w1nlE7_mrxeaIeoGaWrSbneff_oh6VwzVboNKxwDU5cvewfx0I5V2zHjI2O6QGPn_xQj2supCYw8jnXm9gx0bbftmHHSQRsLcdJ5VDVq4NBZ_Z1cM6Qi7I5TtfVvV9xLVBXjR5M8BiYpWIbm3_L7pzldQ2jxJiLTuM2bgk_Xi4mnOCqe0XQ2-1cfrsJra5lCCqmAIMRWhhLRmT8fThVIlA3UbMUTQxBELFTTOo&lib=MJsm1jFL3jq5AgTQNuu_c-NqbKeHUbra5'

/**
 * Esta é a função serverless que a Vercel irá executar.
 * @param {import('http').IncomingMessage} request - O objeto da requisição recebida.
 * @param {import('http').ServerResponse} response - O objeto para enviar a resposta.
 */
export default async function handler(request, response) {
  try {
    // Cabeçalho para simular um navegador, uma boa prática
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
    }

    // Faz a chamada para a API do Google usando fetch
    const googleResponse = await fetch(GOOGLE_API_URL, { headers })

    // Verifica se a resposta do Google foi bem-sucedida
    if (!googleResponse.ok) {
      // Se o Google retornou um erro (4xx, 5xx), captura e o retorna
      throw new Error(`Erro na API do Google: ${googleResponse.status} ${googleResponse.statusText}`)
    }

    // Pega o conteúdo JSON da resposta do Google
    const data = await googleResponse.json()

    // Envia os dados de volta para o Power BI com sucesso
    // Adiciona cabeçalhos para evitar cache, garantindo dados sempre atualizados
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.status(200).json(data)
  } catch (error) {
    // Em caso de qualquer erro (rede, JSON inválido, etc.), loga no console da Vercel
    console.error(error)

    // E envia uma resposta de erro clara para o Power BI
    response.status(500).json({
      error: 'Falha ao buscar dados da fonte do Google.',
      details: error.message,
    })
  }
}
