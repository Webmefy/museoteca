import * as path from 'path';
import * as xlsx from 'xlsx';
import { Product } from '../shared/interfaces/product-xlsx';


function readXlsxFile(filePath: string): Product[] {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawData = xlsx.utils.sheet_to_json<any>(worksheet);
  
  return rawData.map((item: any) => ({
    imageId: item['Image ID'] || item['ID'] || '',
    title: item['Title'] || '',
    author: item['Author'] || ''
  })) as Product[];
}

const filePath = path.resolve(__dirname, '../../products.xlsx');
const products: Product[] = readXlsxFile(filePath);


const mapToExpectedFormat = (product: Product) => {
  if (!product || !product.title) {
    console.error('Producto inválido encontrado:', product);
    return null;
  }

  const baseFields = {
    ID: product.imageId,
    Handle: product.title.toLowerCase().replace(/ /g, '-'),
    Command: "MERGE",
    Title: product.title,
    Body_HTML: "",
    Vendor: "tienda-museothyssen",
    Type: "Museoteca",
    Tags: "",
    Tags_Command: "REPLACE",
    Created_At: new Date().toISOString(),
    Updated_At: new Date().toISOString(),
    Status: "Active",
    Published: "1",
    Published_At: new Date().toISOString(),
    Published_Scope: "global",
    Template_Suffix: "",
    Gift_Card: "0",
    URL: `https://tienda-museothyssen.myshopify.com/products/${product.title.toLowerCase().replace(/ /g, '-')}`,
    Total_Inventory_Qty: "0",
    Row: "",
    Top_Row: "",
    Image_Type: "IMAGE",
    Image_Src: "",
    Image_Command: "MERGE",
    Image_Position: "",
    Image_Width: "",
    Image_Height: "",
    Image_Alt_Text: "",
    Variant_Inventory_Item_ID: "",
    Variant_ID: "",
    Variant_Command: "",
    Option1_Name: "",
    Option1_Value: "",
    Option2_Name: "",
    Option2_Value: "",
    Option3_Name: "",
    Option3_Value: "",
    Variant_Position: "",
    Variant_SKU: "",
    Variant_Barcode: "",
    Variant_Image: "",
    Variant_Weight: "",
    Variant_Weight_Unit: "",
    Variant_Price: "",
    Variant_Compare_At_Price: "",
    Variant_Taxable: "",
    Variant_Tax_Code: "",
    Variant_Inventory_Tracker: "",
    Variant_Inventory_Policy: "",
    Variant_Fulfillment_Service: "",
    Variant_Requires_Shipping: "",
    Variant_Inventory_Qty: "",
    Variant_Inventory_Adjust: "",
    Metafield_title_tag_string: "",
    Metafield_description_tag_string: "",
    Variant_Metafield_pod: {
      author: {
        single_line_text_field: product.author
      },
      id_img: {
        single_line_text_field: product.imageId
      },
      frame_width: {
        number_integer: ""
      },
      id_finish: {
        single_line_text_field: ""
      },
      id_img_2: {
        single_line_text_field: product.imageId
      },
      id_media: {
        single_line_text_field: ""
      },
      id_option: {
        single_line_text_field: ""
      },
      id_size: {
        single_line_text_field: ""
      },
      print_height: {
        number_integer: ""
      },
      print_width: {
        number_integer: ""
      },
      white_border: {
        number_integer: ""
      },
      volumetric_weight: {
        number_decimal: ""
      }
    },
    Variant_Metafield_front_info: {
      resumen_medidas: {
        multi_line_text_field: ""
      },
      volume_weight: {
        number_decimal: ""
      }
    },
    Metafield_magento: {
      id_original: {
        single_line_text_field: ""
      }
    },
    Metafield_back_info: {
      oferta: {
        boolean: ""
      }
    },
    Metafield_web: {
      artista: {
        single_line_text_field: product.author
      },
      id_obra: {
        single_line_text_field: ""
      }
    },
    Metafield_front_info: {
      obra: {
        single_line_text_field: product.title
      },
      category: {
        single_line_text_field: "Reproducción Impresión a la carta"
      }
    },
    Metafield_filter: {
      para: {
        single_line_text_field: ""
      }
    },
    Metafield_facebook: {
      product_catalog: {
        boolean: ""
      }
    },
    Variant_Metafield_magento: {
      acabado_pod: {
        single_line_text_field: ""
      },
      soporte_pod: {
        single_line_text_field: ""
      },
      tamano_pod: {
        single_line_text_field: ""
      },
      ean_pod: {
        single_line_text_field: ""
      },
      frame_width_pod: {
        single_line_text_field: ""
      },
      id_finish_pod: {
        single_line_text_field: ""
      },
      id_media_pod: {
        single_line_text_field: ""
      },
      id_option_pod: {
        single_line_text_field: ""
      },
      id_size_pod: {
        single_line_text_field: ""
      },
      print_height_pod: {
        single_line_text_field: ""
      },
      print_width_pod: {
        single_line_text_field: ""
      },
      white_border_pod: {
        single_line_text_field: ""
      }
    }
  };

  return baseFields;
};

const mappedProducts = products.map(mapToExpectedFormat).filter(Boolean);

console.log('Mapped Products:', mappedProducts);
console.log(JSON.stringify(mappedProducts, null, 2));
