import json
import hashlib
import os
import jwt
import datetime
from flask import Flask
from flask import request, make_response, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__, static_url_path='/static')
CORS(app)
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'MySQL Server Password'
app.config['MYSQL_DB'] = 'Database Name'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)

def md5_hash(string):
    hash = hashlib.md5()
    hash.update(string.encode('utf-8'))
    return hash.hexdigest()


def generate_salt():
    salt = os.urandom(16)
    return salt.hex()


def pagination(page):
    cursor = mysql.connection.cursor()
    cursor.execute("""select blog_id, name, blog_content,blog_title, category,postImageLink, postedAt from users s inner join blogs m on s.user_id = m.user_id inner join blog_category d on d.cat_id = m.cat_id order by blog_id desc""")
    results = cursor.fetchall()
    cursor.close()
    items = []
    for blog in results:
        blog["postedAt"] = datetime.datetime.strftime(blog["postedAt"], "%d %b, %Y")
        items.append(blog)
    total_pages = len(items)//5 + 1
    total_users = len(items)
    return {
        "total_pages": total_pages,
        "total_users": total_users,
        "page": page,
        "data": items[(page*5)-5: page*5],
        "per_page": 5
        }

#Show All User
@app.route('/show-all-user')
def showAllUser():
    cursor = mysql.connection.cursor()
    cursor.execute( """SELECT user_id,name,email,profileImageLink FROM users""" )
    results = cursor.fetchall()
    cursor.close()
    items = []
    for item in results:
        items.append(item)
    return json.dumps(items)

#Show User by Id
@app.route('/show-one-user/<int:user_id>')
def showOneUser(user_id):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT name,user_id,email FROM users where user_id =(%s)""",[user_id] )
    results = cursor.fetchall()
    cursor.close()
    items = []
    for item in results:
        items.append(item)
    return json.dumps(items)

# SignUp
@app.route('/signup',methods=['POST'])  
def create():
    name = request.headers.get('name')
    email = request.headers.get('email')
    password = request.headers.get('password')
    if request.method == 'POST':
        f = request.files['profileImageLink']
        location = "static/img/" + f.filename
        f.save(location)
    flag = False
    salt = generate_salt()
    password_hash = md5_hash(password + salt)
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT * FROM users""")
    results = cursor.fetchall()
    for item in results:
        if str(email) == str(item["email"]):
            flag = True
            mysql.connection.commit()
            cursor.close()
    if flag == True:
        return json.dumps("User Already Exist")
    else:
        cursor.execute(
            """INSERT INTO users (name, email, salt, password_hash, profileImageLink) VALUES (%s, %s, %s, %s,%s) """, (name, email, salt, password_hash,location)
        )
        mysql.connection.commit()
        cursor.close()
        return json.dumps(location)


#Login
@app.route('/login',methods=["POST"])
def login():
    email = request.json["email"]
    password = request.json["password"]
    flag = False
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT * FROM users""")
    results = cursor.fetchall()
    mysql.connection.commit()
    cursor.close()
    for item in results:
        if str(email) == str(item["email"]) and str(item["password_hash"]) == str(md5_hash(password+item["salt"])):
            flag = True
            encoded_jwt = jwt.encode({"user_id":item["user_id"],"name":item["name"],"email":item["email"],"profileImageLink":item["profileImageLink"]}, 'secretkey', algorithm='HS256').decode("utf-8")
            print(item,)
    if flag == True:
        return json.dumps(str(encoded_jwt))
    else:
        return json.dumps("Wrong Password")

#Add Blog Category
@app.route('/add-blog-category',methods=["POST"])
def addBlogCat():
    category = request.json["category"]
    auth_password = request.json["auth_password"]
    password = "amit_1998"
    if str(auth_password) == password:
        cursor = mysql.connection.cursor()
        cursor.execute("""INSERT INTO blog_category (category) VALUES (%s) """, [category])
        mysql.connection.commit()
        cursor.close()
        return json.dumps("Added Successfully")
    else:
        return json.dumps("Wrong Password")

    

#Show All Blog Category
@app.route('/show-blog-category')
def showAllBlogCat():
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT * FROM blog_category""" )
    results = cursor.fetchall()
    cursor.close()
    items = []
    for item in results:
        items.append(item)
    return json.dumps(items)

#Add Blog 
@app.route('/add-blog',methods=["POST"])
def addBlog():
    user_id = int(request.headers.get('user_id'))
    cat_id = int(request.headers.get('cat_id'))
    blog_title = request.headers.get('blog_title')
    blog_content = request.headers.get('blog_content')
    if request.method == 'POST':
        f = request.files['postImageLink']
        location = "static/img/" + f.filename
        f.save(location)
    cursor = mysql.connection.cursor()  
    cursor.execute("""INSERT INTO blogs (user_id,cat_id,blog_title,blog_content,postImageLink) VALUES (%s,%s,%s,%s,%s) """,[user_id,cat_id,blog_title,blog_content,location])
    mysql.connection.commit()
    cursor.close()
    return json.dumps("Added")

#Show All Blog at Home
@app.route('/show-all-blog')
def allBlog():
    page = request.args.get("page", default = 1, type = int)
    return pagination(page) 

#Show Blog by Blog-Id
@app.route('/show-one-blog/<int:blog_id>')
def showOneBlog(blog_id):
    cursor = mysql.connection.cursor()
    cursor.execute("""select blog_id, name, blog_content,blog_title, category,postImageLink,postedAt from users s inner join blogs m on s.user_id = m.user_id and m.blog_id =(%s) inner join blog_category d on d.cat_id = m.cat_id""",[blog_id])
    results = cursor.fetchall()
    cursor.close()
    items = []
    for blog in results:
        blog["postedAt"] = datetime.datetime.strftime(blog["postedAt"], "%d %b, %Y")
        items.append(blog)
    return json.dumps(items)

#Show all-Blog of User by User-Id
@app.route('/show-user-blog/<int:user_id>')
def showUserBlog(user_id):
    cursor = mysql.connection.cursor()
    cursor.execute("""select blog_id, user_id, blog_content, blog_title, category, postImageLink,postedAt from blogs b inner join blog_category c on b.cat_id = c.cat_id where user_id = (%s) order by blog_id desc""" ,[user_id])
    results = cursor.fetchall()
    mysql.connection.commit()
    cursor.close()
    items = []
    for blog in results:
        blog["postedAt"] = datetime.datetime.strftime(blog["postedAt"], "%d %b, %Y")
        items.append(blog)
    return json.dumps(items)

#Edit Blog
@app.route('/edit-blog/<int:blog_id>',methods=["PUT"])
def editBlog(blog_id):
    user_id = request.headers.get('user_id')
    edit_blog_title = request.headers.get('blog_title')
    edit_blog_content = request.headers.get('blog_content')
    cursor = mysql.connection.cursor()
    cursor.execute("""update blogs set blog_title =(%s),blog_content =(%s) where blog_id=(%s) and user_id=(%s)""",[edit_blog_title,edit_blog_content,blog_id,user_id])
    mysql.connection.commit()
    cursor.close()
    return json.dumps("Edited Successfully")

#delete blog
@app.route('/delete-blog/<int:blog_id>',methods=["DELETE"])
def deleteBlog(blog_id):
    user_id = int(request.headers.get('user_id'))
    cursor = mysql.connection.cursor()
    cursor.execute("""delete from comments where blog_id = (%s) and blog_id in(select blog_id from blogs where user_id = (%s))""",[blog_id,user_id])
    cursor.execute("""delete from blogs where blog_id =(%s) and user_id = (%s)""",[blog_id,user_id])
    mysql.connection.commit()
    cursor.close()
    return json.dumps("Delete Successfully")

#Add Comment
@app.route('/add-comment',methods=["POST"])
def addComment():
    user_id = int(request.json["user_id"])
    blog_id = int(request.json["blog_id"])
    comment = request.json["comment"]
    cursor = mysql.connection.cursor()  
    cursor.execute("""INSERT INTO comments (user_id,blog_id,comment) VALUES (%s,%s,%s) """,[user_id,blog_id,comment])
    mysql.connection.commit()
    cursor.close()
    return json.dumps("Added")

# Get all Comments of Particular blog
@app.route('/all-comment-blog/<int:blog_id>')
def allCommentUser(blog_id):
    cursor = mysql.connection.cursor()  
    cursor.execute( """SELECT * FROM comments order by comm_id desc""" )
    results1 = cursor.fetchall()
    cursor.execute( """SELECT * FROM users""" )
    results2 = cursor.fetchall()
    cursor.close()
    items = []
    for item in results1:
        item["commentedAt"] = datetime.datetime.strftime(item["commentedAt"], "%d %b, %H:%M:%S")
        for user in results2:
            if int(item["blog_id"]) == int(blog_id) and int(item["user_id"]) == int(user["user_id"]):
                items.append({"user_id":item["user_id"],"profileImageLink":user["profileImageLink"],"comment":item["comment"],"name":user["name"],"commentedAt":item["commentedAt"],"comm_id":item["comm_id"]})
    return json.dumps(items)
    
#Comment Count
@app.route('/comment-blog-count/<int:blog_id>')
def commentCount(blog_id):
    cursor = mysql.connection.cursor()  
    cursor.execute( """SELECT count(comment) as count FROM comments natural join blogs """ )
    results = cursor.fetchall()
    cursor.close()
    return json.dumps(results)

#Get Comments by Commment Id
@app.route('/get-comment-blog/<int:comm_id>')
def getCommentUser(comm_id):
    cursor = mysql.connection.cursor()  
    cursor.execute( """SELECT * FROM comments""" )
    results1 = cursor.fetchall()
    cursor.close()
    items = []
    for item in results1:
        item["commentedAt"] = datetime.datetime.strftime(item["commentedAt"], "%d %b, %H:%M:%S")
        if int(item["comm_id"]) == int(comm_id):
                items.append(item)
    return json.dumps(items)

#Edit Comments
@app.route('/edit-comment/<int:comm_id>',methods=["PUT"])
def EditComment(comm_id):
    user_id = request.headers.get('user_id')
    comment = request.headers.get('comment')
    cursor = mysql.connection.cursor()
    cursor.execute("""update comments set comment =(%s) where comm_id=(%s) and user_id=(%s)""",[comment,comm_id,user_id])
    mysql.connection.commit()
    cursor.close()
    return json.dumps("Edit Successfully")

#Delete Comments
@app.route('/delete-comment/<int:comm_id>',methods=["DELETE"])
def deleteComment(comm_id):
    user_id = int(request.headers.get('user_id'))
    cursor = mysql.connection.cursor()
    cursor.execute("""delete from comments where user_id = (%s) and comm_id = (%s)""",[user_id,comm_id])
    mysql.connection.commit()
    cursor.close()
    return json.dumps("Delete Successfully")

# Get User Id from token
@app.route('/get-user-token')
def getUserByToken():
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'secretkey', algorithms=['HS256'])
    return json.dumps(decode_data)

if __name__ == "__main__":
    app.run(debug = True)



