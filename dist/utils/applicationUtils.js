"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertAndFormatFileUploaded = convertAndFormatFileUploaded;
const spinal_env_viewer_plugin_excel_manager_service_1 = require("spinal-env-viewer-plugin-excel-manager-service");
async function convertAndFormatFileUploaded(fileData, isExcel = false) {
    let data = isExcel ? await _convertExcelToJson(fileData) : JSON.parse(JSON.stringify(fileData.toString()));
    return _formatAppsJson(data);
}
async function _convertExcelToJson(excelData) {
    const data = await spinal_env_viewer_plugin_excel_manager_service_1.SpinalExcelManager.convertExcelToJson(excelData);
    return Object.values(data).flat();
}
function _formatAppsJson(jsonData) {
    const requiredAttributes = ["name", "categoryName", "groupName", "packageName"];
    return jsonData.reduce((liste, application) => {
        const appHasAllRequiredAttrs = requiredAttributes.find(el => !application[el]); // check if any required attribute is missing
        if (!appHasAllRequiredAttrs)
            return liste; // if any required attribute is missing, skip this application
        application.hasViewer = application.hasViewer || false;
        application.packageName = application.packageName;
        application.isExternalApp = application.isExternalApp?.toString().toLocaleLowerCase() == "false" ? false : Boolean(application.isExternalApp);
        if (application.isExternalApp)
            application.link = application.link;
        if (typeof application.tags === "string")
            application.tags = application.tags.split(",");
        liste.push(application);
        return liste;
    }, []);
}
//# sourceMappingURL=applicationUtils.js.map