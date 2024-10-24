from backend.extensions import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(30), unique=True, nullable=False)
    password = db.Column(db.String(180), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    names = db.Column(db.String(50), unique=False, nullable=False)
    last_names = db.Column(db.String(50), unique=False, nullable=False)
    employee_number = db.Column(db.String(20), unique=True, nullable=False)
    subzone = db.Column(db.String(50), unique=False, nullable=False)
    role = db.Column(db.String(50), unique=False, nullable=False)
    

    providers = db.relationship('Provider', backref='user', lazy=True)
    branch= db.relationship('Branch', backref='user', lazy=True)
    assets = db.relationship('Assets', backref='user', lazy=True)
    messages = db.relationship('Message', backref='user', lazy=True)
    history = db.relationship('History', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.user_name}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_name": self.user_name,
            "is_active": self.is_active,
            "names": self.names,
            "last_names": self.last_names,
            "employee_number": self.employee_number,
            "subzone": self.subzone,
            "role": self.role,
            "providers": [provider.serialize() for provider in self.providers],
            "assets": [asset.serialize() for asset in self.assets],
            "messages": [message.serialize() for message in self.messages],
            "history": [history.serialize() for history in self.history]
        }
    
class Provider(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(50), unique=False, nullable=False)
    rfc = db.Column(db.String(30), unique=True, nullable=False)
    service = db.Column(db.String(50), unique=False, nullable=False)

    assets= db.relationship('Assets', backref='provider', lazy=True)
    messages = db.relationship('Message', backref='provider', lazy=True)
    history = db.relationship('History', backref='provider', lazy=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    branch_id = db.Column(db.Integer, db.ForeignKey('branch.id'), nullable=True)


    def __repr__(self):
        return f'<Provider {self.company_name}>'

    def serialize(self):
        return {
            "id": self.id,
            "branch_id": self.branch_id,
            "company_name": self.company_name,
            "rfc": self.rfc,
            "user_id": self.user_id,
            "service": self.service,
            "assets": [asset.serialize() for asset in self.assets],
            "messages": [message.serialize() for message in self.messages],
            "history": [history.serialize() for history in self.history]
        }
    
class Migration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    installation_date = db.Column(db.Date, unique=False, nullable=False)
    migration_date = db.Column(db.Date, unique=False, nullable=False)
    migration_description = db.Column(db.String(250), unique=False, nullable=False)
    migration_status = db.Column(db.String(50), unique=False, nullable=False)
    

    
    assets = db.relationship('Assets', backref='migration', lazy=True)
    messages = db.relationship('Message', backref='migration', lazy=True)
    history = db.relationship('History', backref='migration', lazy=True)

    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=False)
    branch_id = db.Column(db.Integer, db.ForeignKey('branch.id'), nullable=False)
    

    def __repr__(self):
        return f'<Migration {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "installation_date": self.installation_date,
            "migration_date": self.migration_date,
            "migration_description": self.migration_description,
            "migration_status": self.migration_status,
            "user_id": self.user_id,
            "provider_id": self.provider_id,
            "branch_id": self.branch_id,
            "assets": [asset.serialize() for asset in self.assets],
            "messages": [message.serialize() for message in self.messages],
            "history": [history.serialize() for history in self.history]

        }

    
class Branch(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    branch_cr= db.Column(db.String(50), unique=True, nullable=False)
    branch_address= db.Column(db.String(50), unique=False, nullable=False)
    branch_zone= db.Column(db.String(50), unique=False, nullable=False)
    branch_subzone= db.Column(db.String(50), unique=False, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    providers = db.relationship('Provider', backref='branches', lazy=True)
    UsersMB = db.relationship('UserMB', backref='branches', lazy=True)
    assets = db.relationship('Assets', backref='branches', lazy=True)
    migrations = db.relationship('Migration', backref='branches', lazy=True)
    messages = db.relationship('Message', backref='branches', lazy=True)
    history = db.relationship('History', backref='branches', lazy=True)

    def __repr__(self):
        return f'<Branch {self.branch_cr}>'

    def serialize(self):
        return {
            "id": self.id,
            "branch_cr": self.branch_cr,
            "branch_address": self.branch_address,
            "branch_zone": self.branch_zone,
            "branch_subzone": self.branch_subzone,
            "user_id": self.user_id,
            "providers": [provider.serialize() for provider in self.providers],
            "usersMB": [userMB.serialize() for userMB in self.UsersMB],
            "assets": [asset.serialize() for asset in self.assets],
            "migrations": [migration.serialize() for migration in self.migrations],
            "messages": [message.serialize() for message in self.messages],
            "history": [history.serialize() for history in self.history]
        }
    

class Assets(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    asset_type = db.Column(db.String(50), unique=False, nullable=False)
    asset_brand = db.Column(db.String(50), unique=False, nullable=False)
    asset_model = db.Column(db.String(50), unique=False, nullable=False)
    asset_serial = db.Column(db.String(50), unique=False, nullable=False)
    asset_inventory_number = db.Column(db.String(50), unique=False, nullable=False)
   
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    branch_id = db.Column(db.Integer, db.ForeignKey('branch.id'), nullable=True)
    migration_id = db.Column(db.Integer, db.ForeignKey('migration.id'), nullable=True)
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=False)
    
    
    history = db.relationship('History', backref='assets', lazy=True)
    UsersMB = db.relationship('UserMB', backref='assets', lazy=True)

    def __repr__(self):
        return f'<Assets {self.asset_type}>'

    def serialize(self):
        return {
            "id": self.id,
            "asset_type": self.asset_type,
            "asset_brand": self.asset_brand,
            "asset_model": self.asset_model,
            "asset_serial": self.asset_serial,
            "asset_inventory_number": self.asset_inventory_number,
            "user_id": self.user_id,
            "branch_id": self.branch_id,
            "provider_id": self.provider_id,
            "migration_id": self.migration_id,
            "UsersMB": [userMB.serialize() for userMB in self.UsersMB],
            "history": [history.serialize() for history in self.history]
        }
    
    
class UserMB(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name_MB = db.Column(db.String(30), unique=True, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    names = db.Column(db.String(50), unique=False, nullable=False)
    last_names = db.Column(db.String(50), unique=False, nullable=False)
    employee_number = db.Column(db.String(20), unique=True, nullable=False)

    asset_id = db.Column(db.Integer, db.ForeignKey('assets.id'), nullable=False)

    branch_id = db.Column(db.Integer, db.ForeignKey('branch.id'), nullable=False)

    def __repr__(self):
        return f'<UserMB {self.user_name_MB}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_name_MB": self.user_name_MB,
            "is_active": self.is_active,
            "names": self.names,
            "last_names": self.last_names,
            "employee_number": self.employee_number,
            "branch_id": self.branch_id,
            "asset_id": self.asset_id

        }
    

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(250), unique=False, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    migration_id = db.Column(db.Integer, db.ForeignKey('migration.id'), nullable=True)
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=False)
    branch_id = db.Column(db.Integer, db.ForeignKey('branch.id'), nullable=False)
   
   

    def __repr__(self):
        return f'<Message {self.message}>' 
    
    def serialize(self):
        return {
            "id": self.id,
            "message": self.message,
            "user_id": self.user_id,
            "migration_id": self.migration_id,
            "provider_id": self.provider_id,
            "branch_id": self.branch_id,
        }


class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=True)
    branch_id = db.Column(db.Integer, db.ForeignKey('branch.id'), nullable=True)
    migration_id = db.Column(db.Integer, db.ForeignKey('migration.id'), nullable=True)
    asset_id = db.Column(db.Integer, db.ForeignKey('assets.id'), nullable=True)
    message = db.Column(db.String(250), unique=False, nullable=True)
    date = db.Column(db.Date, unique=False, nullable=True)

    def __repr__(self):
        return f'<History {self.message}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "provider_id": self.provider_id,
            "branch_id": self.branch_id,
            "migration_id": self.migration_id,
            "asset_id": self.asset_id,
            "message": self.message,
            "date": self.date
        }






