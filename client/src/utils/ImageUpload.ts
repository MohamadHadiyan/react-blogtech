export const imageCheck = (file: File) => {
  const types = ["image/png", "image/jpeg"];
  let err = "";

  if (!file) return (err = "File does not exist.");

  if (file.size > 1024 * 1024) {
    err = "The largest image size is 1mb.";
  }

  if (!types.includes(file.type)) {
    err = "The image type is png / jpeg";
  }

  return err;
};

export const imageUpload = async (file: File) => {
  const formdata = new FormData();
  formdata.append("file", file);
  formdata.append("upload_preset", "rmtztzpa");
  formdata.append("cloud_name", "dynhywmtl");

  const res = await fetch("https://api.cloudinary.com/v1_1/dynhywmtl/upload", {
    method: "POST",
    body: formdata,
  });

  const data = await res.json();

  return { public_id: data.public_id, url: data.secure_url };
};
