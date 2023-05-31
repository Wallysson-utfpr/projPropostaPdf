import React, { useState, useCallback } from "react";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import "./styles.css";
import numeral from "numeral";
import "numeral/locales/pt-br";
import morettiImage from "./moretti1.png";
import morettiImage2 from "./moretti2.png";

const App = () => {
  const [dadosProposta, setDadosProposta] = useState({
    data: format(new Date(), "dd/MM/yyyy"),
    endereco: "",
    cidade: "",
    produtos: [
      {
        id: uuidv4(),
        produto: "",
        comprimento: "",
        largura: "",
        altura: "",
        perfil: "",
        corVidro: "",
        espessuraVidro: "",
        quantidade: "",
        valor: "",
        observacoes: [],
      },
    ],
    valorTotal: "",
    desconto: "",
    valorTotalProposta: "",
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setDadosProposta((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleProdutoChange = useCallback((e, index) => {
    const { name, value } = e.target;
    setDadosProposta((prevState) => {
      const produtos = [...prevState.produtos];
      produtos[index] = {
        ...produtos[index],
        [name]: value,
      };
      return { ...prevState, produtos };
    });
  }, []);

  const [novaObservacao, setNovaObservacao] = useState("");

  const handleObservacaoChange = (e, index) => {
    const novasObservacoes = [...dadosProposta.observacoes];
    novasObservacoes[index] = e.target.value;
    setDadosProposta({
      ...dadosProposta,
      observacoes: novasObservacoes,
    });
  };

  const handleRemoverObservacao = (index) => {
    const novasObservacoes = [...dadosProposta.observacoes];
    novasObservacoes.splice(index, 1);
    setDadosProposta({
      ...dadosProposta,
      observacoes: novasObservacoes,
    });
  };

  const handleAdicionarObservacao = () => {
    if (novaObservacao) {
      setDadosProposta((prevDadosProposta) => {
        const observacoes = Array.isArray(prevDadosProposta.observacoes)
          ? prevDadosProposta.observacoes
          : [];
        return {
          ...prevDadosProposta,
          observacoes: [...observacoes, novaObservacao],
        };
      });
      setNovaObservacao("");
    }
  };

  const handleAddProduto = useCallback(() => {
    setDadosProposta((prevState) => ({
      ...prevState,
      produtos: [
        ...prevState.produtos,
        {
          id: uuidv4(),
          produto: "",
          comprimento: "",
          largura: "",
          altura: "",
          perfil: "",
          corVidro: "",
          espessuraVidro: "",
          quantidade: "",
          valor: "",
          observacoes: [],
        },
      ],
    }));
  }, []);

  const handleRemoveProduto = useCallback((id) => {
    setDadosProposta((prevState) => {
      const produtos = prevState.produtos.filter(
        (produto) => produto.id !== id
      );
      return { ...prevState, produtos };
    });
  }, []);

  const [geraPDF, setGerarPDF] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setGerarPDF(true);
    if (geraPDF) {
      setGerarPDF(true);
    } else {
      console.log('Ainda não clicou no botão "Gerar PDF".');
    }
  };

  const handleGerarPDF = () => {
    setGerarPDF(true);
    gerarPDF();
  };

  const gerarPDF = useCallback(() => {
    const doc = new jsPDF();
    const startY = 30;
    const lineHeight = 8;
    let currentY = startY;

    const img = new Image();
    img.src = morettiImage;
    const img2 = new Image();
    img2.src = morettiImage2;

    const adicionarCabecalho = () => {
      doc.addImage(img, "PNG", 14, 8);
      doc.addImage(img2, "PNG", 80, 13);
    };

    const adicionarRodape = () => {
      const rodapeText = "RUA TANCREDO NEVES, SALA 4\nBANDEIRANTES - PR";
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
          rodapeText,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          {
            align: "center",
          }
        );
      }
    };

    adicionarCabecalho();

    doc.line(20, startY + 1 * lineHeight, 190, startY + 1 * lineHeight); // Linha horizontal
    doc.setFontSize(12);
    doc.setFont("Typewriter");
    doc.setFontType("normal");
    doc.text("PEDIDO: 0709", 20, startY + 1.6 * lineHeight, { align: "left" });
    doc.text(`DATA: ${dadosProposta.data}`, 150, startY + 1.6 * lineHeight, {
      align: "right",
    });

    doc.setFont("Wire Type Mono SmallCaps Regular", "normal");
    doc.text(`NOME: `, 20, startY + 2.3 * lineHeight);
    doc.setFont("helvetica", "bold"); // Aplicar estilo negrito
    doc.text(`${dadosProposta.nomeCliente}`, 36, startY + 2.3 * lineHeight);
    doc.setFont("Wire Type Mono SmallCaps Regular", "normal");

    doc.text(`ENDEREÇO: `, 20, startY + 3 * lineHeight);
    doc.setFont("helvetica", "bold");
    doc.text(`${dadosProposta.endereco}`, 47, startY + 3 * lineHeight);
    doc.setFont("Wire Type Mono SmallCaps Regular", "normal");

    doc.text(`CIDADE: `, 20, startY + 3.7 * lineHeight);
    doc.setFont("helvetica", "bold");
    doc.text(`${dadosProposta.cidade}`, 38, startY + 3.7 * lineHeight);
    doc.setFont("Wire Type Mono SmallCaps Regular", "normal");

    doc.line(20, startY + 4.2 * lineHeight, 190, startY + 4.2 * lineHeight); // Linha horizontal
    doc.setFont("helvetica", "bold");
    doc.text(`PROPOSTA: `, 96, startY + 4.8 * lineHeight);
    doc.line(20, startY + 4.9 * lineHeight, 190, startY + 4.9 * lineHeight); // Linha horizontal
    doc.setFont("Wire Type Mono SmallCaps Regular", "normal");

    dadosProposta.produtos.forEach((produto, index) => {
      doc.text(`PRODUTO: `, 20, currentY + 5.7 * lineHeight);
      doc.setFont("helvetica", "bold");
      doc.text(`${produto.produto}`, 46, currentY + 5.7 * lineHeight);
      doc.setFont("Wire Type Mono SmallCaps Regular", "normal");

      doc.text(`COMPRIMENTO: `, 20, currentY + 6.4 * lineHeight);
      doc.setFont("helvetica", "bold");
      doc.text(`${produto.comprimento}`, 54, currentY + 6.4 * lineHeight);
      doc.setFont("Wire Type Mono SmallCaps Regular", "normal");

      doc.text(`LARGURA: `, 105, currentY + 6.4 * lineHeight);
      doc.setFont("helvetica", "bold");
      doc.text(`${produto.largura}`, 130, currentY + 6.4 * lineHeight);
      doc.setFont("Wire Type Mono SmallCaps Regular", "normal");

      doc.text(`ALTURA: `, 150, currentY + 6.4 * lineHeight);
      doc.setFont("helvetica", "bold");
      doc.text(`${produto.altura}`, 170, currentY + 6.4 * lineHeight);
      doc.setFont("Wire Type Mono SmallCaps Regular", "normal");

      doc.text(`PERFIL: `, 20, currentY + 7.1 * lineHeight);
      doc.setFont("helvetica", "bold");
      doc.text(`${produto.perfil}`, 38, currentY + 7.1 * lineHeight);
      doc.setFont("Wire Type Mono SmallCaps Regular", "normal");

      doc.text(`COR DO VIDRO: `, 20, currentY + 7.9 * lineHeight);
      doc.setFont("helvetica", "bold");
      doc.text(`${produto.corVidro}`, 53, currentY + 7.9 * lineHeight);
      doc.setFont("Wire Type Mono SmallCaps Regular", "normal");

      doc.text(`ESPESSURA: `, 80, currentY + 7.9 * lineHeight);
      doc.setFont("helvetica", "bold");
      doc.text(`${produto.espessuraVidro}`, 110, currentY + 7.9 * lineHeight);
      doc.setFont("Wire Type Mono SmallCaps Regular", "normal");

      doc.text(`QTD: `, 130, currentY + 7.9 * lineHeight);
      doc.setFont("helvetica", "bold");
      doc.text(`${produto.quantidade}`, 160, currentY + 7.9 * lineHeight);
      doc.setFont("Wire Type Mono SmallCaps Regular", "normal");

      doc.text(`VALOR R$:`, 158, currentY + 7.9 * lineHeight);
      doc.setFont("helvetica", "bold");
      doc.text(
        `${numeral(produto.valor).format("0,0.00")}`,
        181,
        currentY + 7.9 * lineHeight
      );

      doc.setFont("Wire Type Mono SmallCaps Regular", "normal");
      doc.line(
        20,
        currentY + 8.6 * lineHeight,
        190,
        currentY + 8.6 * lineHeight
      ); // Linha horizontal

      currentY += 4 * lineHeight; // Aumentar a posição vertical para a próxima linha
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // Obter a largura total da página

    numeral.locale("pt-br");

    doc.setFont("helvetica", "bold");
    doc.text(
      `VALOR TOTAL R$:  ${numeral(parseFloat(dadosProposta.valorTotal)).format(
        "0,0.00"
      )}`,
      pageWidth - 28,
      currentY + 6 * lineHeight,
      { align: "right" }
    );

    doc.setFont("helvetica", "bold");
    doc.text(
      `DESCONTO R$:  ${numeral(parseFloat(dadosProposta.desconto)).format(
        "0,0.00"
      )}`,
      pageWidth - 28,
      currentY + 7 * lineHeight,
      { align: "right" }
    );
    const valorTotalProposta =
      parseFloat(dadosProposta.valorTotal) - parseFloat(dadosProposta.desconto);
    doc.setFont("helvetica", "bold");
    doc.text(
      `VALOR TOTAL DA PROPOSTA R$:  ${numeral(valorTotalProposta).format(
        "0,0.00"
      )}`,
      pageWidth - 28,
      currentY + 8 * lineHeight,
      { align: "right" }
    );

    doc.setFont("helvetica", "bold");
    doc.text(
      `VALIDADE DA PROPOSTA: 5 DIAS ÚTEIS`,
      20,
      currentY + 10 * lineHeight
    );

    doc.setFont("helvetica", "bold");
    doc.text(
      "CONDIÇÕES DE PAGAMENTO: A COMBINAR",
      20,
      currentY + 11 * lineHeight
    );

    doc.setFont("helvetica", "bold");
    doc.text(
      "PRAZO DE ENTREGA: ATÉ 20 DIAS ÚTEIS",
      20,
      currentY + 12 * lineHeight
    );

    const observacoes = Array.isArray(dadosProposta.observacoes)
      ? dadosProposta.observacoes.join("\n")
      : "";

    doc.text("OBSERVAÇÃO:", 20, currentY + 14 * lineHeight);
    doc.setFont("helvetica", "bold");
    doc.text(observacoes, 20, currentY + 15 * lineHeight);

    adicionarRodape();

    const pdfData = doc.output("blob");
    saveAs(pdfData, "proposta.pdf");
  }, [dadosProposta]);

  return (
    <div className="dark-overlay">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Nome:</label>
            <input
              type="text"
              name="nomeCliente"
              value={dadosProposta.nomeCliente}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label className="label">Data:</label>
            <input
              type="text"
              name="data"
              value={dadosProposta.data}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label className="label">Endereço:</label>
            <input
              type="text"
              name="endereco"
              value={dadosProposta.endereco}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label className="label">Cidade:</label>
            <input
              type="text"
              name="cidade"
              value={dadosProposta.cidade}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="produtos">
            {dadosProposta.produtos.map((produto, index) => (
              <div key={index} className="produto">
                <div className="form-group">
                  <div className="form-group">
                    <label className="label">Produto:</label>
                    <input
                      type="text"
                      name="produto"
                      value={produto.produto}
                      onChange={(e) => handleProdutoChange(e, index)}
                      className="input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">Perfil:</label>
                  <input
                    type="text"
                    name="perfil"
                    value={produto.perfil}
                    onChange={(e) => handleProdutoChange(e, index)}
                    className="input"
                  />
                </div>
                <div className="form-group inline">
                  <div className="form-group">
                    <label className="label">Cor do Vidro:</label>
                    <input
                      type="text"
                      name="corVidro"
                      value={produto.corVidro}
                      onChange={(e) => handleProdutoChange(e, index)}
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Espessura do Vidro:</label>
                    <input
                      type="text"
                      name="espessuraVidro"
                      value={produto.espessuraVidro}
                      onChange={(e) => handleProdutoChange(e, index)}
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Quantidade:</label>
                    <input
                      type="text"
                      name="quantidade"
                      value={produto.quantidade}
                      onChange={(e) => handleProdutoChange(e, index)}
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Valor:</label>
                    <input
                      type="text"
                      name="valor"
                      value={produto.valor}
                      onChange={(e) => handleProdutoChange(e, index)}
                      className="input"
                    />
                  </div>
                </div>

                <div className="form-group inline">
                  <div className="form-group">
                    <label className="label">Comprimento:</label>
                    <input
                      type="text"
                      name="comprimento"
                      value={produto.comprimento}
                      onChange={(e) => handleProdutoChange(e, index)}
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Largura:</label>
                    <input
                      type="text"
                      name="largura"
                      value={produto.largura}
                      onChange={(e) => handleProdutoChange(e, index)}
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Altura:</label>
                    <input
                      type="text"
                      name="altura"
                      value={produto.altura}
                      onChange={(e) => handleProdutoChange(e, index)}
                      className="input"
                    />
                  </div>
                </div>

                {index > 0 && (
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => handleRemoveProduto(produto.id)}
                  >
                    Remover Produto
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="add-button"
              onClick={handleAddProduto}
            >
              Adicionar Produto
            </button>
          </div>

          <div className="form-group inline">
            <div className="form-group">
              <label className="label">Valor Total:</label>
              <input
                type="text"
                name="valorTotal"
                value={dadosProposta.valorTotal}
                onChange={handleChange}
                className="input-proposta"
              />
            </div>

            <div className="form-group">
              <label className="label">Desconto:</label>
              <input
                type="text"
                name="desconto"
                value={dadosProposta.desconto}
                onChange={handleChange}
                className="input-proposta"
              />
            </div>
          </div>
          <div>
            {Array.isArray(dadosProposta.observacoes) &&
              dadosProposta.observacoes.map((observacao, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={observacao}
                    onChange={(e) => handleObservacaoChange(e, index)}
                    placeholder="Observação"
                  />
                  <button
                    className="remove-obs"
                    onClick={() => handleRemoverObservacao(index)}
                  >
                    Remover Observação
                  </button>
                </div>
              ))}
          </div>

          <div>
            <input
              type="text"
              value={novaObservacao}
              onChange={(e) => setNovaObservacao(e.target.value)}
              placeholder="Nova Observação"
              className="input-proposta"
            />
            <button className="add-obs" onClick={handleAdicionarObservacao}>
              Adicionar Observação
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="generate-button"
              onClick={handleGerarPDF}
            >
              Gerar PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
