/**
 * Функция создания валидного rest ответа
 * @param {any} request - входящий запрос
 * @param {any} responseConfig - ответа в формате :
 * {
    keys: {
      [gateName: string]: container as string,
    }
    values: {
      [gateName: string]: data as any{} | any[] | string,
    }
  }
 * @returns request
 */
function responseData(request, responseConfig) {
  const sessionId = request.body.params.sessionId;
  const gate = resolveGate(request.params.gate_name);
  const isCurrectId = (gate == 'dsConfig') || ((typeof sessionId === 'string') && (sessionId.length >= 1));
  const error = request.body.params.Error;

  console.warn(`------------------------------------------------------------\n
    [REST] => MOCKER request on ${request.params.gate_name} 
    \n------------------------------------------------------------`)
  
  if(error < 0) {
    return { status: 'ERROR', Result: {}};
  }
  
  return {
    status: 'OK',
    Result: Object.assign({
      // информация для отладки
      request: {
        // имя гейта 
        gate: gate,
        // принудительная ошибка
        error: error,
        // параметры запроса
        params: request.params,
        // тело
        body: request.body.params,
      },
    }, 
    // проверка на наличие ошибок
    (!error && isCurrectId) ? {
      status: 'OK',
      [responseConfig.keys[gate]]: union(responseConfig.values[gate], request.body.params[responseConfig.keys[gate]]),
    } : {
      Error: error,
      ErrorCode: '-1',
    })
  };
}

function union(param, map) {
  if (!param) return map || 'не найдено';
  if (typeof param === 'object') {
    return Array.isArray(param) ? _.uniq((map || []).concat(param)) : Object.assign((map || {}), param);
  }
  
  return map;
}

module.exports = responseData;