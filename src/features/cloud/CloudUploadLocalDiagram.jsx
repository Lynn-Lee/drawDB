import { useState } from "react";
import { Button, Modal } from "@douyinfe/semi-ui";
import { IconCloudUploadStroked } from "@douyinfe/semi-icons";
import { useTranslation } from "react-i18next";

import { noBackendCloudRepository } from "../../persistence/cloudRepository";
import { uploadLocalDiagram as defaultUploadLocalDiagram } from "./uploadLocalDiagram";

export default function CloudUploadLocalDiagram({
  enabled,
  repository = noBackendCloudRepository,
  diagram,
  upload = defaultUploadLocalDiagram,
}) {
  const { t } = useTranslation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);

  if (!enabled) {
    return null;
  }

  const confirmUpload = async () => {
    setIsUploading(true);
    const uploadResult = await upload({ repository, diagram });
    setResult(uploadResult);
    setIsUploading(false);
    if (uploadResult.ok) {
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <Button
        type="tertiary"
        icon={<IconCloudUploadStroked />}
        aria-label={t("cloud_upload_local_diagram")}
        onClick={() => {
          setResult(null);
          setIsConfirmOpen(true);
        }}
      >
        {t("cloud_upload_local_diagram")}
      </Button>

      {result?.ok ? (
        <span className="text-sm text-slate-600">
          {t("cloud_upload_success")}
        </span>
      ) : null}

      <Modal
        title={t("cloud_upload_data_disclosure_title")}
        visible={isConfirmOpen}
        okText={t("cloud_upload_confirm")}
        cancelText={t("cancel")}
        confirmLoading={isUploading}
        onOk={confirmUpload}
        onCancel={() => setIsConfirmOpen(false)}
      >
        <p>{t("cloud_upload_data_disclosure_description")}</p>
        <p className="mt-2 text-sm text-slate-600">
          {t("cloud_upload_local_copy_preserved")}
        </p>
        {result && !result.ok ? (
          <p className="mt-3 text-sm text-red-600">
            {result.message || t("cloud_upload_failed")}
          </p>
        ) : null}
      </Modal>
    </>
  );
}
