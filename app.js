const $btnExportar = document.querySelector("#btnExportar"),
$tabla = document.querySelector("#tabla");
$btnExportar.addEventListener("click", function () {
let tableExport = new TableExport($tabla, {
  exportButtons: false,
  filename: "ConsultaBDCOOSALUD",
  sheetname: "ResultadosConsultaMasiva",
});
let datos = tableExport.getExportData();
let preferenciasDocumento = datos.tabla.xlsx;
tableExport.export2file(
  preferenciasDocumento.data,
  preferenciasDocumento.mimeType,
  preferenciasDocumento.filename,
  preferenciasDocumento.fileExtension,
  preferenciasDocumento.merges,
  preferenciasDocumento.RTL,
  preferenciasDocumento.sheetname
);
});


//--------------------------------------------->>>>


$(document).ready(function () {
var m = [];
var dates = $("#dates");
var baseUrl =
  "https://wsserviciosexternos.coosalud.com//Afiliados.svc/getAfiliado/";
var tipDocumentos = {
  1: "CC",
  2: "TI",
  3: "RC",
  4: "CE",
  5: "PE",
}; //Add Otros TipDoc

function copyContent(element) {
  seleccionaTexto(this);
  document.execCommand("copy");
}

function seleccionaTexto(element) {
  var doc = document,
    text = element,
    range,
    selection;
  if (doc.body.createTextRange) {
    //ms
    range = doc.body.createTextRange();
    range.moveToElementText(text);
    range.select();
  } else if (window.getSelection) {
    //all others
    selection = window.getSelection();
    range = doc.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

function respuesta(response) {
  //  console.log(response);
  var ApellidoFinal =
    response.SEGUNDO_APELLIDO == null ? " " : response.SEGUNDO_APELLIDO;
  var NombreFinal =
    response.SEGUNDO_NOMBRE == null ? " " : response.SEGUNDO_NOMBRE;
  var reg = $(".table-data tbody tr").length + 1;
  var iconContributory =
    response.REGIMEN.toUpperCase() == "CONTRIBUTIVO"
      ? '<i class="icon-contributory fas fa-money-bill-alt"></i>'
      : "";

  $(".table-data tbody").append(
    "<tr>" +
      // "<th><div class='custom-control custom-checkbox'><input type='checkbox' class='reg-check custom-control-input' id='reg_" + reg + "'><label class='custom-control-label' for='reg_" + reg + "'></label></div>" +
      // "<th><span class='reg-carnet'>" + response.CARNET + "</span></th>" + -->
      "<th><span class='reg-tip-id'>" +
      response.TIPO_IDENTIFICACION +
      "</span></th>" +
      "<th><span class='reg-num-id'>" +
      response.NUMERO_IDENTIFICACION.trim() +
      "</span></th>" +
      "<td><span class='reg-name'>" +
      response.PRIMER_NOMBRE +
      "</span></td>" +
      "<td><span class='reg-name'>" +
      NombreFinal +
      "</span></td>" +
      "<td><span class='reg-apellido'>" +
      response.PRIMER_APELLIDO +
      "</span></td>" +
      "<td><span class='reg-apellido'>" +
      ApellidoFinal +
      "</span></td>" +
      "<td><span class='reg-fec-nac'>" +
      response.FECHA_NACIMIENTO +
      "</span></td>" +
      "<td><span class='reg-fec-nac'>" +
      response.SEXO +
      "</span></td>" +
      "<td><span class='reg-ciud'>" +
      response.DESCRIPCIONCIUDAD +
      "</span></td>" +
      "<td><span class='reg-dep'>" +
      response.DESCRIPCIONDEPARTAMENTO +
      "</span></td>" +
      "<td><span class='reg-ips'>" +
      response.IPS_ASIGNADA +
      "</span></td>" +
      "<td><span class='reg-estado'>" +
      (response.ESTADO == "AC" ? "ACTIVO" : "INACTIVO") +
      "</span></td>" +
      "<td><span class='reg-ips'>" +
      response.NIVEL_SISBEN +
      "</span></td>" +
      "<td>" +
      iconContributory +
      "<span class='reg-regimen'>" +
      response.REGIMEN.toUpperCase() +
      "</span></td>" +
      "<th><span class='reg-carnet'>" +
      response.RANGO +
      "</span></th>" +
      "<th><span class='reg-carnet'>" +
      response.TIPO_POBLACION +
      "</span></th>" +
      "<th><span class='reg-carnet'>" +
      response.TIPO_POBLACIONDESCRIPCION +
      "</span></th>" +
      "<th><span class='reg-carnet'>" +
      response.DIRECCION +
      "</span></th>" +
      "<th><span class='reg-carnet'>" +
      response.TELEFONO +
      "</span></th>" +
      "<th><span class='reg-carnet'>" +
      response.CELULAR +
      "</span></th>" +
      "<td style='display: none;'><span>" +
      "<a target='_blank' class='link_certificate' href='" +
      "https://sipra.coosalud.com/Reports/Afiliados/GenerarReportesAfiliado.aspx?numDoc=" +
      response.NUMERO_IDENTIFICACION.trim() +
      "&tipoDoc=" +
      response.TIPO_IDENTIFICACION +
      "&tipoReporte=CertificadoAfiliacion'><i class='fas fa-download'></i></a>" +
      "</tr>"
  );

  var regCesar = $(
    ".table-data tbody tr td span.reg-dep:contains(CESAR)"
  )
    .parent()
    .parent();

  var regValledupar = $(
    "td span.reg-ciud:contains(VALLEDUPAR)",
    regCesar
  )
    .parent()
    .parent();
  var regNotValledupar = $("td span.reg-ciud", regCesar)
    .parent()
    .parent()
    .not(regValledupar);

  var regCalidadMedica = $(
    "td span.reg-ips:contains(CALIDAD MEDICA IPS)",
    regValledupar
  )
    .parent()
    .parent();
  var regNotCalidadMedica = $("td span.reg-ips", regValledupar)
    .parent()
    .parent()
    .not(regCalidadMedica);

  var regRetired = $(
    ".table-data tbody td span.reg-estado:contains(INACTIVO)"
  )
    .parent()
    .parent();

  var regContributory = $(
    ".table-data tbody td span.reg-regimen:contains(CONTRIBUTIVO)"
  );
  regContributory.addClass("badge badge-pill badge-info");
  regNotValledupar.addClass("reg-departament");
  regCalidadMedica.addClass("reg-allow");
  regNotCalidadMedica.addClass("reg-other");
  regRetired.addClass("reg-inactive");

  $(".search-section .count-register h5 span").text(
    $(".table-data tbody tr").length
  );

  $(".reg-check").unbind("click");
  $(".reg-check").click(function () {
    var span = $(".reg-num-id", $(this).parent().parent().parent());
    span[0].click();
  });

  $("span[class^='reg-']").unbind("click");
  $("span[class^='reg-']").click(copyContent);

  if ($("#autodownload").prop("checked"))
    $(".table-data tbody td span a.link_certificate").last()[0].click();
}

$(".btn-remove-data").on("click", function () {
  m = [];

  $(".table-data tbody tr").fadeOut(500, function () {
    $(this).remove();
    $(window).scrollTop(0);
    $(".search-section .count-register h5 span").text(
      $(".table-data tbody tr").length
    );
  });
});

$(".btn-download-certificates").click(function () {
  var enlaces = $(".table-data tbody tr td a.link_certificate");

  $(enlaces).each(function (index, element) {
    element.click();
  });

  //   console.log(enlaces);
});

function consulta(doc, codtip) {
  var stt = new Object();
  stt.url = baseUrl + tipDocumentos[codtip] + "/" + doc;
  stt.async = true;
  stt.crossDomain = true;
  stt.method = "GET";

  $.ajax(stt).done((r) => {
    if (r.NUMERO_IDENTIFICACION == null) {
      if (codtip < 5) consulta(doc, codtip + 1);
    } else {
      respuesta(r);
    }
  });
}

$(".btn-search").click(function (e) {
  e.preventDefault();
  $(".search-section .count-register h5 span").text(0);

  if ($("#separator-register").val() == "")
    m = $("#documento").val().split("\t");
  else m = $("#documento").val().split($("#separator-register").val());

  $("#documento").val("");
  $(".table-data tbody").text("");
  for (var doc of m) {
    consulta(doc, 1);
  }
});
});