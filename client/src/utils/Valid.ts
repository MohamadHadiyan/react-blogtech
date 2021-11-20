import { IBlog, ITag, IUserRegister } from "./TypeScript";

export const validRegister = (data: IUserRegister) => {
  const { name, account, password, cf_password } = data;

  const errors: string[] = [];

  if (!name) {
    errors.push("Please enter your name");
  } else if (name.length > 20) {
    errors.push("Your name is up to 20 characters long.");
  }

  if (!account) {
    errors.push("Please enter your email or phone number.");
  } else if (!validateEmail(account) && !validatePhone(account)) {
    errors.push("Email or phone number format is incorrect.");
  }

  const msg = checkPassword(password, cf_password);
  if (msg) errors.push(msg);

  return {
    errMsg: errors,
    errLength: errors.length,
  };
};

export const checkPassword = (password: string, cf_password: string) => {
  if (password.length < 6) {
    return "Password must be atleast 6 characters long.";
  } else if (password !== cf_password) {
    return "Confirm password did not match.";
  }
};

export function validatePhone(phone: string) {
  // const re = /^[+]/g;
  const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;

  return re.test(phone);
}

export function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const validCreateBlog = (blog: IBlog) => {
  const { title, thumbnail, category, description, content } = blog;

  const errors: string[] = [];

  if (title.trim().length < 5) {
    errors.push("Title has at least 5 characters.");
  } else if (title.trim().length > 100) {
    errors.push("Title is up to 100 characters long.");
  }

  if (!thumbnail) {
    errors.push("Thumbnail cannot be left blank.");
  }

  if (!category) {
    errors.push("Category cannot be left blank.");
  }

  if (category === "draft") {
    errors.push("Invalid category name!");
  }

  if (description.trim().length < 50) {
    errors.push("Description has at least 50 characters.");
  } else if (description.trim().length > 300) {
    errors.push("Description is up to 300 characters logn.");
  }

  if (content.trim().length < 2000) {
    errors.push("Content has at least 2000 characters.");
  }

  return {
    errMsg: errors,
    errLength: errors.length,
  };
};

export const validSaveBlog = (blog: IBlog) => {
  const { title, category } = blog;

  const errors: string[] = [];

  if (title.trim().length < 5) {
    errors.push("Title has at least 5 characters.");
  } else if (title.trim().length > 100) {
    errors.push("Title is up to 100 characters long.");
  }

  if (!category) {
    errors.push("Category field is required");
  } else if (category === "draft") {
    errors.push("Invalid category name!");
  }

  return {
    errMsg: errors,
    errLength: errors.length,
  };
};

export const shallowEqaulity = (objectA: any, objectB: any) => {
  const keysA = Object.keys(objectA);
  const keysB = Object.keys(objectB);

  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
    if (Array.isArray(objectA[key])) {
      if (objectA[key].toString() !== objectB[key].toString()) return false;
    } else if (objectA[key] !== objectB[key]) {
      return false;
    }
  }

  return true;
};

/**
 ** arrayA: ITAg[]  === oldTags
 ** arrayB: ITAg[]  === newTags
 */
export function compareTagArrays(arrayA: ITag[], arrayB: ITag[]) {
  let isEqual = true;

  if (arrayA.length === 0 && arrayB.length === 0)
    return {
      isEqual,
      newIDs: [],
      oldIDs: [],
      addedIDs: [],
      newTagNames: [],
      removedIDs: [],
    };

  const oldIDs = arrayA.filter((item) => item._id).map((item) => item._id);
  const newIDs = arrayB.filter((item) => item._id).map((item) => item._id);

  const newTagNames = arrayB
    .filter((item) => !item._id)
    .map((item) => item.name);

  const addedIDs = newIDs.filter((item) =>
    oldIDs.includes(item) ? false : item
  );

  const removedIDs = oldIDs.filter((item) =>
    newIDs.includes(item) ? false : item
  );

  if (newTagNames.length)
    return {
      isEqual: false,
      newIDs,
      oldIDs,
      addedIDs,
      newTagNames,
      removedIDs,
    };

  if (oldIDs.length >= newIDs.length) {
    oldIDs.forEach((item) => {
      if (!newIDs.includes(item)) isEqual = false;
    });
  } else {
    newIDs.forEach((item) => {
      if (!oldIDs.includes(item)) isEqual = false;
    });
  }

  return {
    isEqual,
    newIDs,
    oldIDs,
    addedIDs,
    newTagNames,
    removedIDs,
  };
}
