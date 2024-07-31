export enum TypeOfLineFTP {
    'O' = 'O', // linea de pedido
    'C' = 'C', // linea de datos de contacto y envio
    'P' = 'P', // linea de producto
}

export enum ShippingStatusFTP {}
// 1- Museo	a	cliente
// 2- Museo	a	cliente
// 3- Recogida	en	tienda
// 4- Envío	desde	Museoteca	a	cliente
// 5-Envío	desde	Museoteca	a	Museo	y	de	Museo a	cliente
// 6-Envío	desde	Museoteca	a	cliente
// 7-Envío	desde	Museoteca	a	Museo	y	de	Museo a	cliente
// 8- Recogida	en	tienda	con	producto	Museoteca

export enum SupportsFTP {
    LI = 'LI',
    EM = 'EM',
}

export enum SizesFTP {
    B4 = 'B4', // XS (25 cm	lado largo de la imagen)
    B3 = 'B3', // S	(40	cm lado largo de la imagen)
    B2 = 'B2', // M	(50	cm lado largo de la imagen)
    B1 = 'B1', // L	(70	cm lado largo de la imagen)
    B0 = 'B0', // XL (80 cm lado largo de la imagen)
    BA = 'BA', // XXL (95 cm lado largo de la imagen)
}

export enum FinisherIdentifiersFTP {
    FL = 'FL', // 'sin	marco'
    LB = 'LB', // 'bastidor'
    MA = 'MA', // 'Madera	natural	(papel)'
    MB = 'MB', // 'Madera	Wengué	(papel)'
    MC = 'MC', // 'Madera	negra	(papel)'
    MD = 'MD', // 'Madera	natural	(lienzo)'
    ME = 'ME', // 'Madera	Wengué	(lienzo)'
    MF = 'MF', // 'Madera	negra	(lienzo)'
}
