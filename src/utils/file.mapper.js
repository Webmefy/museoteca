"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var museoteca_enum_1 = require("../shared/enums/museoteca.enum");
var FileMapper = /** @class */ (function () {
    function FileMapper() {
    }
    FileMapper.prototype.parseProductsFileFTP = function (productFile) {
        var products = [];
        var optionsMap = {};
        for (var _i = 0, productFile_1 = productFile; _i < productFile_1.length; _i++) {
            var line = productFile_1[_i];
            var lineParsed = line.split('|');
            if (lineParsed[0] === museoteca_enum_1.TypeOfLineFTP.O) {
                var imageId = lineParsed[1];
                if (!optionsMap[imageId]) {
                    optionsMap[imageId] = [];
                }
                var supportId = museoteca_enum_1.SupportsFTP[lineParsed[4]];
                var sizeId = museoteca_enum_1.SizesFTP[lineParsed[5]];
                var finisherId = museoteca_enum_1.FinisherIdentifiersFTP[lineParsed[6]];
                var option = {
                    typeOfLine: lineParsed[0],
                    imageId: imageId,
                    title: null,
                    optionId: lineParsed[3],
                    supportId: supportId,
                    sizeId: sizeId,
                    finisherId: finisherId,
                    imageHeight: parseInt(lineParsed[7]),
                    imageMargin: parseInt(lineParsed[8]),
                    imageWidth: parseInt(lineParsed[9]),
                    imageFrame: parseInt(lineParsed[10]),
                    price: parseFloat(lineParsed[11]),
                    available: parseInt(lineParsed[12]),
                };
                optionsMap[imageId].push(option);
            }
        }
        for (var _a = 0, productFile_2 = productFile; _a < productFile_2.length; _a++) {
            var line = productFile_2[_a];
            var lineParsed = line.split('|');
            if (lineParsed[0] === museoteca_enum_1.TypeOfLineFTP.P) {
                var imageId = lineParsed[1];
                var options = optionsMap[imageId] || [];
                var product = {
                    typeOfLine: lineParsed[0],
                    imageId: imageId,
                    title: lineParsed[2],
                    author: lineParsed[3],
                    available: parseInt(lineParsed[6]),
                    options: options,
                };
                products.push(product);
            }
        }
        return products;
    };
    FileMapper.prototype.parseContactFileFTP = function (contactLine, orderId) {
        var contactInfo = contactLine.split('|');
        return {
            typeOfLine: museoteca_enum_1.TypeOfLineFTP.C,
            orderId: orderId,
            firstName: contactInfo[2],
            lastName: contactInfo[3],
            telephone: contactInfo[4],
            email: contactInfo[5],
            receivedFirstName: contactInfo[6],
            receivedLastName: contactInfo[7],
            country: contactInfo[8],
            state: contactInfo[9],
            city: contactInfo[10],
            postalCode: contactInfo[11],
            address: contactInfo[12],
            shippingMethod: parseInt(contactInfo[13]),
        };
    };
    FileMapper.prototype.parseProductItemFileFTP = function (productLine, orderId) {
        var plParsed = productLine.split('|');
        return {
            typeOfLine: plParsed[0],
            orderId: orderId,
            imageId: plParsed[2],
            imageTitle: plParsed[3],
            imageAuthor: plParsed[4],
            optionId: plParsed[5],
            quantity: parseInt(plParsed[6]),
            price: parseFloat(plParsed[7]),
        };
    };
    FileMapper.prototype.parseOrdersFileFTP = function (orderFile) {
        var _this = this;
        var orders = [];
        orderFile.forEach(function (line) {
            var lineParsed = line.split('|');
            if (lineParsed[0] === museoteca_enum_1.TypeOfLineFTP.O) {
                var orderId_1 = lineParsed[1];
                var contactLine = orderFile.find(function (concatLine) {
                    return concatLine.startsWith("".concat(museoteca_enum_1.TypeOfLineFTP.C, "|").concat(orderId_1));
                });
                if (!contactLine) {
                    throw new Error("Customer not found in order ".concat(orderId_1));
                }
                var contact = _this.parseContactFileFTP(contactLine, orderId_1);
                var products = orderFile
                    .filter(function (productLine) {
                    return productLine.startsWith("".concat(museoteca_enum_1.TypeOfLineFTP.P, "|").concat(orderId_1));
                })
                    .map(function (productLine) { return _this.parseProductItemFileFTP(productLine, orderId_1); });
                var order = {
                    typeOfLine: lineParsed[0],
                    id: orderId_1,
                    totalPrice: Number.parseFloat(lineParsed[2]),
                    createdAt: lineParsed[3],
                    contact: contact,
                    products: products,
                };
                orders.push(order);
            }
        });
        return orders;
    };
    return FileMapper;
}());
exports.default = new FileMapper();
