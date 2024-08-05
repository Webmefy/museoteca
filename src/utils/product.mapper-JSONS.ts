import * as fs from 'fs';
import * as path from 'path';

const filePath = path.resolve(__dirname, '../../products.json');
const rawdata = fs.readFileSync(filePath);
const products = JSON.parse(rawdata.toString());

const mapToExpectedFormat = (product: any) => {
    const baseFields = {
        "ID": product.ID,
        "Handle": product.Title.toLowerCase().replace(/ /g, '-'),
        "Command": "MERGE",
        "Title": product.Title,
        "Body HTML": product["Body HTML"] || "",
        "Vendor": product.Vendor || "tienda-museothyssen",
        "Type": product.Type || "Museoteca",
        "Tags": product.Tags || "",
        "Tags Command": product["Tags Command"] || "REPLACE",
        "Created At": product["Created At"] || new Date().toISOString(),
        "Updated At": product["Updated At"] || new Date().toISOString(),
        "Status": product.Status || "Active",
        "Published": product.Published || "1",
        "Published At": product["Published At"] || new Date().toISOString(),
        "Published Scope": product["Published Scope"] || "global",
        "Template Suffix": product["Template Suffix"] || "",
        "Gift Card": product["Gift Card"] || "0",
        "URL": product.URL || `https://tienda-museothyssen.myshopify.com/products/${product.Title.toLowerCase().replace(/ /g, '-')}`,
        "Total Inventory Qty": product["Total Inventory Qty"] || "0",
        "Row #": product["Row #"] || "",
        "Top Row": product["Top Row"] || "",
        "Image Type": product["Image Type"] || "IMAGE",
        "Image Src": product["Image Src"] || "",
        "Image Command": product["Image Command"] || "MERGE",
        "Image Position": product["Image Position"] || "",
        "Image Width": product["Image Width"] || "",
        "Image Height": product["Image Height"] || "",
        "Image Alt Text": product["Image Alt Text"] || "",
        "Variant Inventory Item ID": product["Variant Inventory Item ID"] || "",
        "Variant ID": product["Variant ID"] || "",
        "Variant Command": product["Variant Command"] || "",
        "Option1 Name": product["Option1 Name"] || "",
        "Option1 Value": product["Option1 Value"] || "",
        "Option2 Name": product["Option2 Name"] || "",
        "Option2 Value": product["Option2 Value"] || "",
        "Option3 Name": product["Option3 Name"] || "",
        "Option3 Value": product["Option3 Value"] || "",
        "Variant Position": product["Variant Position"] || "",
        "Variant SKU": product["Variant SKU"] || "",
        "Variant Barcode": product["Variant Barcode"] || "",
        "Variant Image": product["Variant Image"] || "",
        "Variant Weight": product["Variant Weight"] || "",
        "Variant Weight Unit": product["Variant Weight Unit"] || "",
        "Variant Price": product["Variant Price"] || "",
        "Variant Compare At Price": product["Variant Compare At Price"] || "",
        "Variant Taxable": product["Variant Taxable"] || "",
        "Variant Tax Code": product["Variant Tax Code"] || "",
        "Variant Inventory Tracker": product["Variant Inventory Tracker"] || "",
        "Variant Inventory Policy": product["Variant Inventory Policy"] || "",
        "Variant Fulfillment Service": product["Variant Fulfillment Service"] || "",
        "Variant Requires Shipping": product["Variant Requires Shipping"] || "",
        "Variant Inventory Qty": product["Variant Inventory Qty"] || "",
        "Variant Inventory Adjust": product["Variant Inventory Adjust"] || "",
        "Metafield: title_tag [string]": product["Metafield: title_tag [string]"] || "",
        "Metafield: description_tag [string]": product["Metafield: description_tag [string]"] || "",
        "Variant Metafield: pod": product["Variant Metafield: pod"] || {
            "author": {
                "single_line_text_field": ""
            },
            "id_img": {
                "single_line_text_field": ""
            },
            "frame_width": {
                "number_integer": ""
            },
            "id_finish": {
                "single_line_text_field": ""
            },
            "id_img_2": {
                "single_line_text_field": ""
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
        "Variant Metafield: front_info": product["Variant Metafield: front_info"] || {
            "resumen_medidas": {
                "multi_line_text_field": ""
            },
            "volume_weight": {
                "number_decimal": ""
            }
        },
        "Metafield: magento": product["Metafield: magento"] || {
            "id_original": {
                "single_line_text_field": ""
            }
        },
        "Metafield: back_info": product["Metafield: back_info"] || {
            "oferta": {
                "boolean": ""
            }
        },
        "Metafield: web": product["Metafield: web"] || {
            "artista": {
                "single_line_text_field": ""
            },
            "id_obra": {
                "single_line_text_field": ""
            }
        },
        "Metafield: front_info": product["Metafield: front_info"] || {
            "obra": {
                "single_line_text_field": ""
            },
            "category": {
                "single_line_text_field": "Reproducción Impresión a la carta"
            }
        },
        "Metafield: filter": product["Metafield: filter"] || {
            "para": {
                "single_line_text_field": ""
            }
        },
        "Metafield: facebook": product["Metafield: facebook"] || {
            "product_catalog": {
                "boolean": ""
            }
        },
        "Variant Metafield: magento": product["Variant Metafield: magento"] || {
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

const mappedProducts = products.map(mapToExpectedFormat);

console.log(JSON.stringify(mappedProducts, null, 2));
