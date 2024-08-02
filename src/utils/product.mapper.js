"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var file_mapper_1 = require("./file.mapper");
var rawdata = fs.readFileSync('../test.json');
var productFile = JSON.parse(rawdata.toString());
var products = file_mapper_1.default.parseProductsFileFTP(productFile);
console.log('Products:', products);
var mapToExpectedFormat = function (product) {
    var baseFields = {
        "ID": product.imageId,
        "Handle": product.title.toLowerCase().replace(/ /g, '-'),
        "Command": "MERGE",
        "Title": product.title,
        "Body HTML": "",
        "Vendor": "tienda-museothyssen",
        "Type": "Museoteca",
        "Tags": "",
        "Tags Command": "REPLACE",
        "Created At": new Date().toISOString(),
        "Updated At": new Date().toISOString(),
        "Status": "Active",
        "Published": "1",
        "Published At": new Date().toISOString(),
        "Published Scope": "global",
        "Template Suffix": "",
        "Gift Card": "0",
        "URL": "https://tienda-museothyssen.myshopify.com/products/".concat(product.title.toLowerCase().replace(/ /g, '-')),
        "Total Inventory Qty": "0",
        "Row #": "",
        "Top Row": "",
        "Image Type": "IMAGE",
        "Image Src": "",
        "Image Command": "MERGE",
        "Image Position": "",
        "Image Width": "",
        "Image Height": "",
        "Image Alt Text": "",
        "Variant Inventory Item ID": "",
        "Variant ID": "",
        "Variant Command": "",
        "Option1 Name": "",
        "Option1 Value": "",
        "Option2 Name": "",
        "Option2 Value": "",
        "Option3 Name": "",
        "Option3 Value": "",
        "Variant Position": "",
        "Variant SKU": "",
        "Variant Barcode": "",
        "Variant Image": "",
        "Variant Weight": "",
        "Variant Weight Unit": "",
        "Variant Price": "",
        "Variant Compare At Price": "",
        "Variant Taxable": "",
        "Variant Tax Code": "",
        "Variant Inventory Tracker": "",
        "Variant Inventory Policy": "",
        "Variant Fulfillment Service": "",
        "Variant Requires Shipping": "",
        "Variant Inventory Qty": "",
        "Variant Inventory Adjust": "",
        "Metafield: title_tag [string]": "",
        "Metafield: description_tag [string]": "",
        "Variant Metafield: pod": {
            "author": {
                "single_line_text_field": product.author
            },
            "id_img": {
                "single_line_text_field": product.imageId
            },
            "frame_width": {
                "number_integer": ""
            },
            "id_finish": {
                "single_line_text_field": ""
            },
            "id_img_2": {
                "single_line_text_field": product.imageId
            },
            "id_media": {
                "single_line_text_field": ""
            },
            "id_option": {
                "single_line_text_field": ""
            },
            "id_size": {
                "single_line_text_field": ""
            },
            "print_height": {
                "number_integer": ""
            },
            "print_width": {
                "number_integer": ""
            },
            "white_border": {
                "number_integer": ""
            },
            "volumetric_weight": {
                "number_decimal": ""
            }
        },
        "Variant Metafield: front_info": {
            "resumen_medidas": {
                "multi_line_text_field": ""
            },
            "volume_weight": {
                "number_decimal": ""
            }
        },
        "Metafield: magento": {
            "id_original": {
                "single_line_text_field": ""
            }
        },
        "Metafield: back_info": {
            "oferta": {
                "boolean": ""
            }
        },
        "Metafield: web": {
            "artista": {
                "single_line_text_field": product.author
            },
            "id_obra": {
                "single_line_text_field": ""
            }
        },
        "Metafield: front_info": {
            "obra": {
                "single_line_text_field": product.title
            },
            "category": {
                "single_line_text_field": "Reproducción Impresión a la carta"
            }
        },
        "Metafield: filter": {
            "para": {
                "single_line_text_field": ""
            }
        },
        "Metafield: facebook": {
            "product_catalog": {
                "boolean": ""
            }
        },
        "Variant Metafield: magento": {
            "acabado_pod": {
                "single_line_text_field": ""
            },
            "soporte_pod": {
                "single_line_text_field": ""
            },
            "tamano_pod": {
                "single_line_text_field": ""
            },
            "ean_pod": {
                "single_line_text_field": ""
            },
            "frame_width_pod": {
                "single_line_text_field": ""
            },
            "id_finish_pod": {
                "single_line_text_field": ""
            },
            "id_media_pod": {
                "single_line_text_field": ""
            },
            "id_option_pod": {
                "single_line_text_field": ""
            },
            "id_size_pod": {
                "single_line_text_field": ""
            },
            "print_height_pod": {
                "single_line_text_field": ""
            },
            "print_width_pod": {
                "single_line_text_field": ""
            },
            "white_border_pod": {
                "single_line_text_field": ""
            }
        }
    };
    return baseFields;
};
var mappedProducts = products.map(mapToExpectedFormat);
console.log('Mapped Products:', mappedProducts);
console.log(JSON.stringify(mappedProducts, null, 2));
