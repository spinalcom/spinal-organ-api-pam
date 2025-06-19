import { IApp } from "../interfaces";
import { SpinalExcelManager } from "spinal-env-viewer-plugin-excel-manager-service";


export async function convertAndFormatFileUploaded(fileData: Buffer, isExcel: boolean = false): Promise<IApp[]> {
    let data = isExcel ? await _convertExcelToJson(fileData) : JSON.parse(JSON.stringify(fileData.toString()));

    return _formatAppsJson(data);
}


async function _convertExcelToJson(excelData: Buffer) {
    const data = await SpinalExcelManager.convertExcelToJson(excelData);
    return Object.values(data).flat();
}

function _formatAppsJson(jsonData: IApp[]): IApp[] {
    const requiredAttributes = ["name", "categoryName", "groupName", "packageName"];

    return jsonData.reduce((liste, application) => {

        const appHasAllRequiredAttrs = requiredAttributes.find(el => !application[el]); // check if any required attribute is missing
        if (!appHasAllRequiredAttrs) return liste; // if any required attribute is missing, skip this application


        application.hasViewer = application.hasViewer || false;
        application.packageName = application.packageName;
        application.isExternalApp = application.isExternalApp?.toString().toLocaleLowerCase() == "false" ? false : Boolean(application.isExternalApp)

        if (application.isExternalApp) application.link = application.link;

        if (typeof application.tags === "string") application.tags = (application.tags as string).split(",")

        liste.push(application);

        return liste;
    }, [])

}