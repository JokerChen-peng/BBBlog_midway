import React, { useState } from "react";
import { Alert } from "antd";
export default function Tea() {
  return (
    <div>
      <Alert
        message="请注意"
        description="不要发不良的信息呦!"
        type="info"
        showIcon
      />
      <br />
    </div>
  );
}
