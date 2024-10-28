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
    
    users_mb = db.relationship('UserMB', backref='user', lazy=True)
    providers = db.relationship('Provider', backref='user', lazy=True)
    branch = db.relationship('Branch', backref='user', lazy=True)
    assets = db.relationship('Assets', backref='user', lazy=True)
    messages = db.relationship('Message', backref='user', lazy=True)
    history = db.relationship('History', backref='user', lazy=True)
    admins = db.relationship('Admins', backref='user', lazy=True)
    engineers = db.relationship('Engineer', backref='user', lazy=True) 
    links = db.relationship('Link', backref='user', lazy=True)

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
            "users_mb": [userMB.serialize() for userMB in self.users_mb],
            "providers": [provider.serialize() for provider in self.providers],
            "assets": [asset.serialize() for asset in self.assets],
            "messages": [message.serialize() for message in self.messages],
            "history": [history.serialize() for history in self.history],
            "admins": [admins.serialize() for admins in self.admins],
            "engineers": [engineer.serialize() for engineer in self.engineers],
            "links": [link.serialize() for link in self.links]
        }


class Admins(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(180), unique=False, nullable=False)
    names = db.Column(db.String(50), unique=False, nullable=False)
    last_names = db.Column(db.String(50), unique=False, nullable=False)
    employee_number = db.Column(db.String(50), unique=False, nullable=False)
    subzone = db.Column(db.String(50), unique=False, nullable=False)
    is_active = db.Column(db.Boolean, unique=False, nullable=False)
    role = db.Column(db.String(50), unique=False, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    engineers = db.relationship('Engineer', backref='admins', lazy=True)  
    users_mb = db.relationship('UserMB', backref='admins', lazy=True)
    providers = db.relationship('Provider', backref='admins', lazy=True)
    branch = db.relationship('Branch', backref='admins', lazy=True)
    assets = db.relationship('Assets', backref='admins', lazy=True)
    messages = db.relationship('Message', backref='admins', lazy=True)
    history = db.relationship('History', backref='admins', lazy=True)
    links = db.relationship('Link', backref='admins', lazy=True)

    def __repr__(self):
        return f'<Admins {self.user_name}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "user_name": self.user_name,
            "names": self.names,
            "last_names": self.last_names,
            "employee_number": self.employee_number,
            "subzone": self.subzone,
            "is_active": self.is_active,
            "role": self.role,
            "user_id": self.user_id,
            "engineers": [engineer.serialize() for engineer in self.engineers],  
            "users_mb": [userMB.serialize() for userMB in self.users_mb],
            "providers": [provider.serialize() for provider in self.providers],
            "branch": [branch.serialize() for branch in self.branch],
            "assets": [asset.serialize() for asset in self.assets],
            "messages": [message.serialize() for message in self.messages],
            "history": [history.serialize() for history in self.history],
            "links": [link.serialize() for link in self.links]
        }


class Engineer(db.Model):  
    id = db.Column(db.Integer, primary_key=True)
    user_name = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(180), unique=False, nullable=False)
    names = db.Column(db.String(50), unique=False, nullable=False)
    last_names = db.Column(db.String(50), unique=False, nullable=False)
    employee_number = db.Column(db.String(50), unique=False, nullable=False)
    subzone = db.Column(db.String(50), unique=False, nullable=False)
    is_active = db.Column(db.Boolean, unique=False, nullable=False)
    role = db.Column(db.String(50), unique=False, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    admins_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=True)

    users_mb = db.relationship('UserMB', backref='engineer', lazy=True)  
    providers = db.relationship('Provider', backref='engineer', lazy=True)
    branch = db.relationship('Branch', backref='engineer', lazy=True)
    assets = db.relationship('Assets', backref='engineer', lazy=True)
    messages = db.relationship('Message', backref='engineer', lazy=True)
    history = db.relationship('History', backref='engineer', lazy=True)
    links = db.relationship('Link', backref='engineer', lazy=True)

    def __repr__(self):
        return f'<Engineer {self.user_name}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "user_name": self.user_name,
            "names": self.names,
            "last_names": self.last_names,
            "employee_number": self.employee_number,
            "subzone": self.subzone,
            "is_active": self.is_active,
            "role": self.role,
            "admins_id": self.admins_id,
            "users_mb": [userMB.serialize() for userMB in self.users_mb],
            "providers": [provider.serialize() for provider in self.providers],
            "branch": [branch.serialize() for branch in self.branch],
            "assets": [asset.serialize() for asset in self.assets],
            "messages": [message.serialize() for message in self.messages],
            "history": [history.serialize() for history in self.history],
            "links": [link.serialize() for link in self.links]
        }


class Provider(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(50), unique=False, nullable=False)
    rfc = db.Column(db.String(30), unique=True, nullable=False)
    service = db.Column(db.String(50), unique=False, nullable=False)

    assets = db.relationship('Assets', backref='provider', lazy=True)
    messages = db.relationship('Message', backref='provider', lazy=True)
    history = db.relationship('History', backref='provider', lazy=True)
    links = db.relationship('Link', backref='provider', lazy=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    admins_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=True)  
    branch_id = db.Column(db.Integer, db.ForeignKey('branch.id'), nullable=True)
    engineer_id = db.Column(db.Integer, db.ForeignKey('engineer.id'), nullable=True)

    def __repr__(self):
        return f'<Provider {self.company_name}>'

    def serialize(self):
        return {
            "id": self.id,
            "branch_id": self.branch_id,
            "company_name": self.company_name,
            "rfc": self.rfc,
            "user_id": self.user_id,
            "admins_id": self.admins_id,
            "engineer.id" : self.engineer_id, 
            "service": self.service,
            "assets": [asset.serialize() for asset in self.assets],
            "messages": [message.serialize() for message in self.messages],
            "history": [history.serialize() for history in self.history],
            "links": [link.serialize() for link in self.links]
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
    links = db.relationship('Link', backref='migration', lazy=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=True)
    admins_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=True)
    engineer_id = db.Column(db.Integer, db.ForeignKey('engineer.id'), nullable=True)  
    branch_id = db.Column(db.Integer, db.ForeignKey('branch.id'), nullable=True)

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
            "admins_id": self.admins_id,
            "engineer_id": self.engineer_id,  
            "assets": [asset.serialize() for asset in self.assets],
            "messages": [message.serialize() for message in self.messages],
            "history": [history.serialize() for history in self.history],
            "links": [link.serialize() for link in self.links]
        }

    
class Branch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    branch_cr = db.Column(db.String(50), unique=True, nullable=False)
    branch_address = db.Column(db.String(50), unique=False, nullable=False)
    branch_zone = db.Column(db.String(50), unique=False, nullable=False)
    branch_subzone = db.Column(db.String(50), unique=False, nullable=False)
    branch_work_stations = db.Column(db.String(50), unique=False, nullable=False)
    branch_category = db.Column(db.String(50), unique=False, nullable=False)
    branch_saturday = db.Column(db.String(50), unique=False, nullable=False)


    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    admins_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=True)
    engineer_id = db.Column(db.Integer, db.ForeignKey('engineer.id'), nullable=True)  

    providers = db.relationship('Provider', backref='branches', lazy=True)
    users_mb = db.relationship('UserMB', backref='branches', lazy=True)
    assets = db.relationship('Assets', backref='branches', lazy=True)
    migrations = db.relationship('Migration', backref='branches', lazy=True)
    messages = db.relationship('Message', backref='branches', lazy=True)
    history = db.relationship('History', backref='branches', lazy=True)
    links = db.relationship('Link', backref='branches', lazy=True)

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
            "admins_id": self.admins_id,
            "engineer_id": self.engineer_id,  
            "branch_work_stations": self.branch_work_stations,
            "branch_category": self.branch_category,
            "branch_saturday": self.branch_saturday,
            "providers": [provider.serialize() for provider in self.providers],
            "users_mb": [userMB.serialize() for userMB in self.users_mb],
            "assets": [asset.serialize() for asset in self.assets],
            "migrations": [migration.serialize() for migration in self.migrations],
            "messages": [message.serialize() for message in self.messages],
            "history": [history.serialize() for history in self.history],
            "links": [link.serialize() for link in self.links]
        }
    

class Assets(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    asset_type = db.Column(db.String(50), unique=False, nullable=False)
    asset_brand = db.Column(db.String(50), unique=False, nullable=False)
    asset_model = db.Column(db.String(50), unique=False, nullable=False)
    asset_serial = db.Column(db.String(50), unique=False, nullable=False)
    asset_inventory_number = db.Column(db.String(50), unique=False, nullable=False)
   
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    admins_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=True)
    engineer_id = db.Column(db.Integer, db.ForeignKey('engineer.id'), nullable=True)  
    branch_id = db.Column(db.Integer, db.ForeignKey('branch.id'), nullable=True)
    migration_id = db.Column(db.Integer, db.ForeignKey('migration.id'), nullable=True)
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=True)
    
    history = db.relationship('History', backref='assets', lazy=True)
    users_mb = db.relationship('UserMB', backref='assets', lazy=True)

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
            "admins_id": self.admins_id,
            "engineer_id": self.engineer_id,  
            "branch_id": self.branch_id,
            "provider_id": self.provider_id,
            "migration_id": self.migration_id,
            "users_mb": [userMB.serialize() for userMB in self.users_mb],
            "history": [history.serialize() for history in self.history]
        }
    
    
class UserMB(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(50), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    names = db.Column(db.String(50), unique=False, nullable=False)
    last_names = db.Column(db.String(50), unique=False, nullable=False)
    employee_number = db.Column(db.String(20), unique=True, nullable=False)
    extension_phone = db.Column(db.String(50), unique=False, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    asset_id = db.Column(db.Integer, db.ForeignKey('assets.id'), nullable=True)
    branch_id = db.Column(db.Integer, db.ForeignKey('branch.id'), nullable=True)
    admins_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=True)
    engineer_id = db.Column(db.Integer, db.ForeignKey('engineer.id'), nullable=True)  

    def __repr__(self):
        return f'<UserMB {self.user_name_MB}>'

    def serialize(self):
        return {
            "id": self.id,
            "role": self.role,
            "is_active": self.is_active,
            "names": self.names,
            "last_names": self.last_names,
            "employee_number": self.employee_number,
            "extension_phone": self.extension_phone,
            "branch_id": self.branch_id,
            "user_id": self.user_id,
            "asset_id": self.asset_id,
            "admins_id": self.admins_id,
            "engineer_id": self.engineer_id  
        }
    

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String(250), unique=False, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    migration_id = db.Column(db.Integer, db.ForeignKey('migration.id'), nullable=True)
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=False)
    branch_id = db.Column(db.Integer, db.ForeignKey('branch.id'), nullable=False)
    admins_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=True)
    engineer_id = db.Column(db.Integer, db.ForeignKey('engineer.id'), nullable=True)  

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
            "admins_id": self.admins_id,
            "engineer_id": self.engineer_id 
        }


class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, unique=False, nullable=True)
    message = db.Column(db.String(250), unique=False, nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=True)
    branch_id = db.Column(db.Integer, db.ForeignKey('branch.id'), nullable=True)
    migration_id = db.Column(db.Integer, db.ForeignKey('migration.id'), nullable=True)
    asset_id = db.Column(db.Integer, db.ForeignKey('assets.id'), nullable=True)
    admins_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=True)
    engineer_id = db.Column(db.Integer, db.ForeignKey('engineer.id'), nullable=True)  
    link_id = db.Column(db.Integer, db.ForeignKey('link.id'), nullable=True)

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
            "date": self.date,
            "admins_id": self.admins_id,
            "engineer_id": self.engineer_id,  
            "link_id": self.link_id
        }



class Link(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), unique=False, nullable=False)
    description = db.Column(db.String(250), unique=False, nullable=False)
    speed = db.Column(db.String(50), unique=False, nullable=False)
    status = db.Column(db.String(50), unique=False, nullable=False)
    

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    admins_id = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=True)
    engineer_id = db.Column(db.Integer, db.ForeignKey('engineer.id'), nullable=True)  
    branch_id = db.Column(db.Integer, db.ForeignKey('branch.id'), nullable=True)
    provider_id = db.Column(db.Integer, db.ForeignKey('provider.id'), nullable=True)
    migration_id = db.Column(db.Integer, db.ForeignKey('migration.id'), nullable=True)


    history = db.relationship('History', backref='links', lazy=True)

    def __repr__(self):
        return f'<Link {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "type": self.type,
            "description": self.description,
            "speed": self.speed,
            "status": self.status,
            "user_id": self.user_id,
            "admins_id": self.admins_id,
            "engineer_id": self.engineer_id,  
            "branch_id": self.branch_id,
            "provider_id": self.provider_id,
            "migration_id": self.migration_id,
            "history": [history.serialize() for history in self.history]
        }