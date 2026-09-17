const Draft = () => <div className="notice warn">Rascunho em revisão jurídica. Versão 2026-09.</div>

export function Terms() {
  return (
    <article className="card prose">
      <p className="eyebrow">Programa de Indicações Huint</p>
      <h1>Termos do programa</h1>
      <Draft />
      <h3>1. Como funciona</h3>
      <p>Qualquer pessoa registada pode indicar à Huint uma empresa que possa beneficiar dos seus serviços, identificando um contacto dessa empresa. Se a indicação der origem a um contrato assinado com a Huint, quem a fez tem direito a uma comissão.</p>
      <h3>2. Requisitos de uma indicação válida</h3>
      <ul>
        <li>O contacto indicado foi previamente informado e <strong>aceitou ser contactado pela Huint</strong>, sabendo quem o indicou.</li>
        <li>A empresa não é já cliente da Huint nem está em negociação ativa com a Huint.</li>
        <li>O contacto não foi indicado antes por outra pessoa. Vale a primeira indicação registada.</li>
        <li>Não é partilhada informação confidencial da empresa indicada.</li>
      </ul>
      <h3>3. Exclusões</h3>
      <ul>
        <li>Colaboradores, administradores ou pessoas com influência na decisão de contratação da empresa indicada.</li>
        <li>Entidades públicas, salvo acordo escrito prévio com a Huint.</li>
        <li>Colaboradores da Huint.</li>
      </ul>
      <h3>4. Comissão</h3>
      <p>A comissão corresponde a <strong>10% do valor do primeiro contrato</strong>, sem IVA, e é paga depois de a Huint receber o pagamento do cliente, proporcionalmente aos montantes recebidos. O pagamento exige a emissão do documento fiscal adequado por quem fez a indicação.</p>
      <h3>5. Validade</h3>
      <p>Cada indicação é válida durante 6 meses a contar da data de registo. Um contrato assinado depois desse prazo não dá direito a comissão.</p>
      <h3>6. Decisão da Huint</h3>
      <p>A Huint decide livremente se contacta a empresa indicada e se celebra contrato, sem que isso gere qualquer obrigação perante quem fez a indicação.</p>
      <h3>7. Alterações</h3>
      <p>A Huint pode alterar ou terminar o programa. As indicações válidas registadas antes da alteração mantêm as condições em vigor à data do registo.</p>
    </article>
  )
}

export function Privacy() {
  return (
    <article className="card prose">
      <p className="eyebrow">Programa de Indicações Huint</p>
      <h1>Aviso de privacidade</h1>
      <Draft />
      <h3>Responsável pelo tratamento</h3>
      <p>Huint. Contacto para questões de privacidade: <a href="mailto:privacidade@huint.me">privacidade@huint.me</a>.</p>
      <h3>Dados de quem faz a indicação</h3>
      <p>Tratamos o seu nome, email e o registo das indicações para gerir a sua participação e pagar comissões. A base legal é a execução dos termos do programa (art. 6.º, n.º 1, al. b) do RGPD) e o cumprimento de obrigações fiscais. Conservamos os dados enquanto participar e depois pelo prazo legal aplicável à documentação fiscal.</p>
      <h3>Dados da pessoa indicada</h3>
      <p>Tratamos o nome, email profissional, empresa e a descrição do desafio indicados, bem como a identificação de quem fez a indicação. A finalidade é um contacto comercial B2B que a pessoa aceitou previamente receber. A base legal é o interesse legítimo da Huint (art. 6.º, n.º 1, al. f) do RGPD). No primeiro contacto informamos a pessoa da origem dos dados e do seu direito de oposição. Se não houver interesse, ou a indicação expirar sem contrato, os dados são apagados no prazo de 6 meses.</p>
      <h3>Subcontratantes</h3>
      <p>Supabase (alojamento da base de dados na UE, Irlanda), Vercel (alojamento do site) e Resend (envio de emails).</p>
      <h3>Os seus direitos</h3>
      <p>Pode pedir acesso, retificação, apagamento, limitação ou portabilidade dos dados e opor-se ao tratamento, através de <a href="mailto:privacidade@huint.me">privacidade@huint.me</a>. Tem também o direito de apresentar reclamação à CNPD (<a href="https://www.cnpd.pt" target="_blank" rel="noreferrer">www.cnpd.pt</a>).</p>
    </article>
  )
}
