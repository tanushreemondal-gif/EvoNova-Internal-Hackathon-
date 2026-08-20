import os
from werkzeug.utils import secure_filename#for add pic
from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.secret_key = "renthub_secret"

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Upload folder
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    full_name = db.Column(db.String(100))
    phone = db.Column(db.String(15))
    city = db.Column(db.String(100))
    bio = db.Column(db.Text)

class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(200), nullable=False)
    rent = db.Column(db.Integer, nullable=False)
    location = db.Column(db.String(200), nullable=False)

    property_type = db.Column(db.String(50))
    description = db.Column(db.Text)
    image = db.Column(db.String(200))
    owner_id = db.Column(db.Integer)
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username).first()

        if user:
            flash("Username already exists!")
            return redirect(url_for('register'))

        new_user = User(
            username=username,
            password=password
        )

        db.session.add(new_user)
        db.session.commit()

        flash("Registration Successful!")
        return redirect(url_for('login'))

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(
            username=username,
            password=password
        ).first()
        if user:
            session['user_id'] = user.id
            session['username'] = user.username
            return redirect(url_for('dashboard'))

        flash("Invalid Username or Password!")

    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    return render_template(
        'dashboard.html',
        username=session['username']
    )

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/profile', methods=['GET', 'POST'])
def profile():

    if 'user_id' not in session:
        return redirect(url_for('login'))

    user = User.query.get(session['user_id'])

    if request.method == 'POST':
        user.full_name = request.form['full_name']
        user.phone = request.form['phone']
        user.city = request.form['city']
        user.bio = request.form['bio']

        db.session.commit()

        flash("Profile Updated!")

    return render_template('profile.html', user=user)


@app.route('/add-property', methods=['GET', 'POST'])
def add_property():

    if 'user_id' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        image = request.files['image']
        filename = secure_filename(image.filename)

        image.save(
            os.path.join(
                app.config['UPLOAD_FOLDER'],
                filename
            )
        )
        property = Property(
            title=request.form['title'],
            rent=request.form['rent'],
            location=request.form['location'],
            property_type=request.form['property_type'],
            description=request.form['description'],
            image=filename,
            owner_id=session['user_id']
        )

        db.session.add(property)
        db.session.commit()

        flash("Property Added Successfully!")

        return redirect(url_for('dashboard'))

    return render_template('add_property.html')

if __name__ == '__main__':
    with app.app_context():
        db.drop_all()      # Deletes all old tables
        db.create_all()    # Creates new tables

    app.run(debug=True)