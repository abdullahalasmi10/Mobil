import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

// إعدادات Appwrite

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aora",
  projectId: "67630dd9002bcda7b60d",
  storageId: "67631488000a03de999f",
  databaseId: "676310a8001b20338507",
  userCollectionId: "676310fc0020a2b23011",
  videoCollectionId: "67631136000ee78d6556",
};

// إعداد العميل
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// إنشاء مستخدم جديد
export async function createUser(email, password, username) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error.message || "Failed to create user.");
  }
}

// تسجيل الدخول
export async function signIn(email, password) {
  try {
    // حذف الجلسة الحالية إذا كانت موجودة
    await account.deleteSession("current").catch(() => {
      // لا تفعل شيئًا إذا لم تكن هناك جلسة
    });

    // إنشاء جلسة جديدة
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error("Login failed. Please check your email or password.");
  }
}

// جلب الحساب الحالي
export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    throw new Error("Failed to fetch account.");
  }
}

// جلب بيانات المستخدم الحالي
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

// تسجيل الخروج
export async function signOut() {
  try {
    // حذف الجلسة الحالية
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.warn("No session to delete.");
    return null;
  }
}

// دالة لتسجيل الدخول ومعالجة البيانات
export async function handleSignIn(email, password) {
  try {
    // تسجيل الدخول
    const session = await signIn(email, password);

    // جلب بيانات المستخدم
    const user = await getCurrentUser();
    if (!user) throw new Error("Failed to fetch user data.");

    return user; // المستخدم الناجح
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred.");
  }
}

// استخدام الكود في الواجهة الأمامية
export async function submit(email, password, setUser, setIsLogged, router) {
  try {
    const user = await handleSignIn(email, password);
    setUser(user);
    setIsLogged(true);

    Alert.alert("Success", "Logged in successfully!");
    router.replace("/home");
  } catch (error) {
    Alert.alert("Error", error.message);
  }
}
