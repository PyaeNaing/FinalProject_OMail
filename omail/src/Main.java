import com.google.gson.*;
import spark.Request;
import spark.Response;
import static spark.Spark.*;
import java.util.*;

public class Main {

    public static String processRoute(Request req, Response res) {
        Set<String> params = req.queryParams();
        for (String param : params) {
            // possible for query param to be an array
            System.out.println(param + " : " + req.queryParamsValues(param)[0]);
        }
        // do stuff with a mapped version http://javadoc.io/doc/com.sparkjava/spark-core/2.8.0
        // http://sparkjava.com/documentation#query-maps
        // print the id query value
        System.out.println(req.queryMap().get("id").value());
        return "done!";
    }
    static int getHerokuAssignedPort() {
        ProcessBuilder processBuilder = new ProcessBuilder();
        if (processBuilder.environment().get("PORT") != null) {
            return Integer.parseInt(processBuilder.environment().get("PORT"));
        }
        return 1234; //return default port if heroku-port isn't set (i.e. on localhost)
    }

    public static void main(String[] args) {

        Database d = Database.getInstance();
        port(Integer.valueOf(getHerokuAssignedPort()));

        options("/*",
                (request, response) -> {

                    String accessControlRequestHeaders = request
                            .headers("Access-Control-Request-Headers");
                    if (accessControlRequestHeaders != null) {
                        response.header("Access-Control-Allow-Headers",
                                accessControlRequestHeaders);
                    }

                    String accessControlRequestMethod = request
                            .headers("Access-Control-Request-Method");
                    if (accessControlRequestMethod != null) {
                        response.header("Access-Control-Allow-Methods",
                                accessControlRequestMethod);
                    }

                    return "OK";
                });
        before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));

        post("/create", (req, res) -> {
            String body = req.body();
            return ProcessNetwork.createNewUser(getString(body,"user"),getString(body,"password"),d);
        });

        post("/login", (req, res) -> {
            String body = req.body();
            return ProcessNetwork.login(getString(body,"user"),getString(body,"password"),d);
        });

        post("/mail", (req, res) -> {
            String body = req.body();
            return ProcessNetwork.showMail(getString(body, "user"),getString(body,"Show"),d);
        });

        post("/send", (req, res) -> {
            String body = req.body();
            return ProcessNetwork.sendMail(getString(body, "from"),getString(body,"to"),getString(body,"subject"), getString(body,"msg"), d);
        });

        get("/test", (req, res) ->{
            return "Success";
        });
    }



    public static String getString(String string, String type)
    {
        Gson gson = new Gson();
        JsonObject job = gson.fromJson(string, JsonObject.class);

        return job.get(type).toString().replace("\"","");
    }

}
