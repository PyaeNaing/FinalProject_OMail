import static com.mongodb.client.model.Filters.*;
import com.google.gson.*;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import java.util.*;

public class Database {
  private static Database instance = null;
  private MongoClient mongoClient;
  private MongoDatabase db;
  private MongoCollection<Document> myCollectionUsers;
  private MongoCollection<Document> myCollectionMail;
  private MongoClientURI uri;


  private Database() {

    uri = new MongoClientURI(
            "mongodb://dbUser:dbUser@res-shard-00-00-d3ykx.gcp.mongodb.net:27017,res-shard-00-01-d3ykx.gcp.mongodb.net:27017,res-shard-00-02-d3ykx.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Res-shard-0&authSource=admin&retryWrites=true");
    mongoClient = new MongoClient(uri);
    db = mongoClient.getDatabase("REST2");
    myCollectionUsers = db.getCollection("users ");
    myCollectionMail = db.getCollection("mail ");


  }

  public static Database getInstance() {
    if (instance == null) {
      instance = new Database();
    }
    return instance;
  }

  public boolean createUser(String username, String password) {
    Document search = myCollectionUsers.find(eq("User", username)).first();
    if (search == null) {
      Document doc = new Document("User", username).append("Password", password);
      myCollectionUsers.insertOne(doc);
      return true;
    }
    return false;
  }

  public boolean loginCheck(String user, String pass) {

    try {
      Document search = myCollectionUsers.find(eq("User", user)).first();
      return (search.getString("User").equals(user) &&
              search.getString("Password").equals(pass));
    } catch (Exception e) {
      return false;
    }
  }

  //checks to see if user exists
  public boolean userExists(String user) {
    Document search = myCollectionUsers.find(eq("User", user)).first();
    return search != null;
  }

  public boolean storeMail(Mail mail) {
    //this method stores the mail in database
    //return true if successful, false otherwise.
    if (userExists(mail.getRecipient())) {
      Document doc = new Document("Sender", mail.getSender()).append("Recipient", mail.getRecipient())
              .append("Subject", mail.getSubject()).append("MailBody", mail.getMailBody())
              .append("Date", mail.getTimeDate()).append("MailID", mail.getMailID()).append("Trash", mail.isTrash())
              .append("TrashSent", mail.isTrashSend()).append("DeletedRec", mail.didRecepientDelete())
              .append("DeletedSender", mail.didSenderDelete());
      myCollectionMail.insertOne(doc);
      return true;
    } else {
      return false;
    }
  }

  public ArrayList<String> showMail(String user, String mailType) {
    ArrayList<String> list = new ArrayList<>();
    MongoCursor<Document> cursor = myCollectionMail.find(eq(mailType, user)).iterator();
    try {
      while (cursor.hasNext()) {
        String w = cursor.next().toJson();
        list.add(w);
      }
    } finally {
      cursor.close();
    }
    return list;
  }
  public boolean moveMail(String mailId, String destination, String user) {
    //this method moves the mail from current list to destination list.
    //return true if successful, false otherwise.\
    //TODO: Find better matching strategy
    if (destination.equals("Trash")) {
      Document search;
      try {
        search = myCollectionMail.find(eq("MailID", mailId)).first();
      } catch (Exception e) {
        return false;
      }
      Gson gson = new Gson();
      String m = search.toJson();
      Mail mail = gson.fromJson(m, Mail.class);
      myCollectionMail.deleteOne(search);
      if(user.equals(mail.getRecipient())) {
        mail.moveToTrash();
      } else if(user.equals(mail.getSender())) {
        mail.moveToTrashSent();
      }
      storeMail(mail);
    }
    return true;
  }

  public boolean deleteMail(String mailId, String user) {
    //this method permanently deletes the mail from database
    //return true if successful, false otherwise.
    //Mails can only be deleted if they are in trash
    //TODO: Find better matching strategy
    Document search;
    try {
      search = myCollectionMail.find(eq("MailID", mailId)).first();
    } catch (Exception e) {
      return false;
    }
    Gson gson = new Gson();
    String m = search.toJson();
    Mail mail = gson.fromJson(m, Mail.class);
    if(user.equals(mail.getRecipient())) {
      mail.recepientDelete();
      myCollectionMail.deleteOne(search);
      storeMail(mail);
    }else if(user.equals(mail.getSender())) {
      mail.senderDelete();
      myCollectionMail.deleteOne(search);
      storeMail(mail);
    }
    if (mail.didRecepientDelete() && mail.didSenderDelete()) {
      myCollectionMail.deleteOne(search);
    }
    return true;
  }

}

