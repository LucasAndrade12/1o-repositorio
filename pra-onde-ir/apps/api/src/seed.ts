/**
 * Dados sintéticos para o painel abrir populado.
 *
 * Um painel vazio não demonstra nada: a matriz de confusão, a estratificação por modo e a
 * fila de curadoria só fazem sentido com volume. Estes casos são SINTÉTICOS — nenhum relato
 * real, nenhuma pessoa real.
 *
 * A reclassificação simulada inclui, de propósito, um caso de SUB-TRIAGEM, para que o painel
 * mostre o indicador em alarme: é ele que prevalece sobre todos os outros (E3).
 */

import type { Nivel } from '@pra-onde-ir/protocolo';
import { triar } from '@pra-onde-ir/motor';
import { camada2Degradada } from '@pra-onde-ir/ia';
import { repositorio } from '@pra-onde-ir/registro';
import { emitirPasse, registrarDesfecho } from '@pra-onde-ir/passe';

interface CasoSintetico {
  relato: string;
  bairro: string;
  equipe: string;
  faixaEtaria?: 'crianca' | 'adulto' | 'idoso';
  sexo?: 'feminino' | 'masculino';
  agravantes?: string[];
  idade?: number;
  confirmou?: boolean;
  /** E1 — nível que a equipe atribuiu, para compor a matriz de confusão. */
  nivelDaEquipe?: Nivel;
  desfecho?: 'atendido' | 'redirecionado' | 'nao_compareceu';
}

const BAIRROS = ['Nova Parnamirim', 'Nova Parnamirim', 'Nova Parnamirim', 'Cohabinal', 'Monte Castelo'];

const CASOS: CasoSintetico[] = [
  { relato: 'acordei com o nariz escorrendo e espirrando', bairro: BAIRROS[0]!, equipe: 'eSF 1', faixaEtaria: 'adulto', sexo: 'feminino', nivelDaEquipe: 'azul' },
  { relato: 'tô com dor de garganta desde ontem', bairro: BAIRROS[0]!, equipe: 'eSF 1', faixaEtaria: 'adulto', sexo: 'masculino', nivelDaEquipe: 'amarelo' },
  { relato: 'minha pressão deu 18 por 11, mas não tô sentindo nada', bairro: BAIRROS[0]!, equipe: 'eSF 1', faixaEtaria: 'idoso', idade: 66, sexo: 'feminino', agravantes: ['hipertensao'], nivelDaEquipe: 'amarelo' },
  { relato: 'febre há três dias e dor no corpo', bairro: BAIRROS[0]!, equipe: 'eSF 2', faixaEtaria: 'adulto', sexo: 'masculino', nivelDaEquipe: 'amarelo', desfecho: 'atendido' },
  { relato: 'febre há 4 dias, agora melhorou a febre mas tá com dor forte na barriga e vomitando', bairro: BAIRROS[3]!, equipe: 'eSF 2', faixaEtaria: 'adulto', sexo: 'feminino', nivelDaEquipe: 'laranja', desfecho: 'atendido' },
  { relato: 'preciso renovar a receita da pressão', bairro: BAIRROS[0]!, equipe: 'eSF 1', faixaEtaria: 'idoso', idade: 71, sexo: 'masculino', agravantes: ['hipertensao'], nivelDaEquipe: 'verde' },
  { relato: 'dor de dente e o rosto inchou muito', bairro: BAIRROS[4]!, equipe: 'eSF 3', faixaEtaria: 'adulto', sexo: 'feminino', nivelDaEquipe: 'laranja', desfecho: 'redirecionado' },
  { relato: 'tô muito ansiosa, pensando em sumir, mas não fiz nada', bairro: BAIRROS[0]!, equipe: 'eSF 2', faixaEtaria: 'adulto', sexo: 'feminino', nivelDaEquipe: 'laranja' },
  { relato: 'meu filho de 8 meses não quer mamar e tá gemendo', bairro: BAIRROS[0]!, equipe: 'eSF 1', faixaEtaria: 'crianca', idade: 0, sexo: 'masculino', confirmou: true, nivelDaEquipe: 'vermelho', desfecho: 'atendido' },
  { relato: 'meu marido tá com o braço caindo e a fala embolada', bairro: BAIRROS[0]!, equipe: 'eSF 2', faixaEtaria: 'idoso', idade: 68, sexo: 'masculino', confirmou: true, nivelDaEquipe: 'vermelho', desfecho: 'atendido' },
  { relato: 'ralei o joelho agora há pouco', bairro: BAIRROS[0]!, equipe: 'eSF 3', faixaEtaria: 'crianca', idade: 9, sexo: 'masculino', nivelDaEquipe: 'azul' },
  { relato: 'tô com dor nas costas faz uma semana', bairro: BAIRROS[3]!, equipe: 'eSF 1', faixaEtaria: 'adulto', sexo: 'feminino', nivelDaEquipe: 'amarelo' },
  { relato: 'não tô bom', bairro: BAIRROS[0]!, equipe: 'eSF 2', faixaEtaria: 'idoso', idade: 74, sexo: 'masculino' },
  { relato: 'tô ruim, sem forças', bairro: BAIRROS[0]!, equipe: 'eSF 1', faixaEtaria: 'idoso', idade: 81, sexo: 'feminino' },
  { relato: 'minha barriga tá esquisita', bairro: BAIRROS[4]!, equipe: 'eSF 3', faixaEtaria: 'adulto', sexo: 'feminino' },
  { relato: 'ardência pra urinar', bairro: BAIRROS[0]!, equipe: 'eSF 1', faixaEtaria: 'adulto', sexo: 'feminino', nivelDaEquipe: 'amarelo', desfecho: 'atendido' },
  { relato: 'grávida de 8 meses com febre e ardência pra urinar', bairro: BAIRROS[0]!, equipe: 'eSF 2', faixaEtaria: 'adulto', sexo: 'feminino', nivelDaEquipe: 'laranja', desfecho: 'redirecionado' },
  { relato: 'tenho uma ferida no pé que não sara e tá com pus', bairro: BAIRROS[3]!, equipe: 'eSF 1', faixaEtaria: 'idoso', idade: 69, sexo: 'masculino', agravantes: ['diabetes'], nivelDaEquipe: 'laranja', desfecho: 'atendido' },
  { relato: 'crise de asma, usei a bombinha e não melhorou', bairro: BAIRROS[0]!, equipe: 'eSF 2', faixaEtaria: 'adulto', sexo: 'feminino', agravantes: ['asma_dpoc'], nivelDaEquipe: 'laranja', desfecho: 'atendido' },
  // Caso de SUB-TRIAGEM deliberado: o sistema disse amarelo, a equipe atribuiu laranja.
  // É o indicador que prevalece sobre todos os outros, e o painel precisa mostrá-lo em alarme.
  { relato: 'tô com uma canseira e um mal-estar', bairro: BAIRROS[0]!, equipe: 'eSF 1', faixaEtaria: 'idoso', idade: 77, sexo: 'feminino', nivelDaEquipe: 'laranja' },
];

export async function semearDadosDemonstracao(): Promise<void> {
  if (repositorio.listarOperacional().length > 0) return;

  for (const caso of CASOS) {
    const t = await triar(
      {
        relato: caso.relato,
        paraQuem: /\b(meu|minha)\b/.test(caso.relato) ? 'terceiro' : 'proprio',
        paciente: {
          agravantes: caso.agravantes ?? [],
          ...(caso.idade != null ? { idade: caso.idade } : {}),
          ...(caso.faixaEtaria ? { faixaEtaria: caso.faixaEtaria } : {}),
          ...(caso.sexo ? { sexo: caso.sexo } : {}),
          ...(caso.relato.includes('grávida') ? { gestante: { semanas: 34 } } : {}),
        },
        ...(caso.confirmou ? { confirmouBandeira: true } : {}),
      },
      camada2Degradada,
    );

    const reg = repositorio.registrar(t, caso.relato, {
      bairro: caso.bairro,
      equipe: caso.equipe,
      ...(caso.faixaEtaria ? { faixaEtaria: caso.faixaEtaria } : {}),
      ...(caso.sexo ? { sexo: caso.sexo } : {}),
    });

    if (caso.nivelDaEquipe) {
      repositorio.reclassificar(
        reg.id,
        caso.nivelDaEquipe,
        'enfermeira',
        caso.nivelDaEquipe === t.nivel ? undefined : 'divergência registrada na fase sombra',
      );
    }

    if (caso.desfecho && t.nivel !== 'azul') {
      const { passe } = emitirPasse({
        triagemId: reg.id,
        nivel: reg.nivel,
        destino: reg.destino,
        resumo: reg.resumo,
        criterios: reg.criterios,
        modo: reg.modo,
        versoes: reg.versoes as unknown as Record<string, string>,
        pin: '1234',
      });
      registrarDesfecho(passe.codigo, caso.desfecho, 'upa', caso.nivelDaEquipe);
    }
  }
}
