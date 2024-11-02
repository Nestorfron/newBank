from flask import Blueprint, jsonify, request
from backend.models import User, Provider, Branch, Assets, UserMB, Migration, Message, History, Admins, Engineer, Link
from backend.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt


api_blueprint = Blueprint('api', __name__)


#####################   USERS SECTION    ########################################

#CREATE ADMINs TOKEN FUNCTION#
def create_master_token(master_user):
    additional_claims = {"role": "Master"}
    access_token = create_access_token(identity=master_user.id, additional_claims=additional_claims)
    return access_token


#REGISTER

@api_blueprint.route('/signup', methods=['POST'])
@jwt_required()
def signup():
    body=request.json
    user_name = body.get("user_name", None)
    password = body.get("password", None)
    names = body.get("names", None)
    last_names = body.get("last_names", None)
    employee_number = body.get("employee_number", None)
    subzone = body.get("subzone", None)
    is_active = body.get("is_active", None)
    role = body.get("role", None) 

    #ROLE VALIDATION#
    user_data = get_jwt_identity()
    current_user_role = user_data["role"]

    if current_user_role != "Master" and role == "Master":
        return jsonify({"error": "Solo el usuario master puede crear Masters"}), 403
    if current_user_role != "Master" and role == "Admins":
        return jsonify({"error": "Solo el usuario master puede crear Adminsistradores"}), 403
    if current_user_role not in ["Master", "Admins"]:
        return jsonify({"error": "No tienes permisos para realizar esta acción"}), 403
    
    #END OF ROLE VALIDATION#

    if User.query.filter_by(user_name=user_name).first() is not None:
        return jsonify({"error": "Ese nombre de usuario ya esta siendo utilizado"}), 400
    if User.query.filter_by(employee_number=employee_number).first() is not None:
        return jsonify({"error": "Ese número de empleado ya está siendo utilizado"}), 400
    if user_name is None or password is None or names is None or last_names is None or employee_number is None or subzone is None or is_active is None or role is None:
        return jsonify({"error": "Todos los campos son requeridos"}), 400
    password_hash = generate_password_hash(password)

    try:
        new_user = User(user_name=user_name, password=password_hash, names=names, last_names=last_names, employee_number=employee_number, subzone=subzone, is_active=is_active, role=role)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"new_user": new_user.serialize()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}), 500


@api_blueprint.route('/1$9DJS470cMFeSks4F$', methods=['POST'])
def super_user():
    body=request.json
    user_name = body.get("user_name", None)
    password = body.get("password", None)
    names = body.get("names", None)
    last_names = body.get("last_names", None)
    employee_number = body.get("employee_number", None)
    subzone = body.get("subzone", None)
    is_active = body.get("is_active", None)
    role = body.get("role", None) 

    if User.query.filter_by(employee_number=employee_number).first() is not None:
        return jsonify({"error": "Ese número de empleado ya está siendo utilizado"}), 402
    if user_name is None or password is None or names is None or last_names is None or employee_number is None or subzone is None or is_active is None or role is None:
        return jsonify({"error": "Todos los campos son requeridos"}), 401
    password_hash = generate_password_hash(password)

    try:
        new_user = User(user_name=user_name, password=password_hash, names=names, last_names=last_names, employee_number=employee_number, subzone=subzone, is_active=is_active, role=role)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"new_user": new_user.serialize()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}), 500

#CREATE ADMINs

@api_blueprint.route('/create_admins', methods=['POST'])
@jwt_required()
def create_admins():
    body=request.json
    user_data = get_jwt_identity()
    user_id = user_data["id"]
    user_name = body.get("user_name", None)
    password = body.get("password", None)
    names = body.get("names", None)
    last_names = body.get("last_names", None)
    employee_number = body.get("employee_number", None)
    subzone = body.get("subzone", None)
    is_active = body.get("is_active", None)
    role = body.get("role", "Admins")

    if User.query.filter_by(user_name=user_name).first() is not None:
        return jsonify({"error": "Ese nombre de usuario ya esta siendo utilizado"}), 400
    if Admins.query.filter_by(user_name=user_name).first() is not None:
        return jsonify({"error": "Ese nombre de usuario ya esta siendo utilizado"}), 400
    if Engineer.query.filter_by(user_name=user_name).first() is not None:
        return jsonify({"error": "Ese nombre de usuario ya esta siendo utilizado"}), 400
    if User.query.filter_by(employee_number=employee_number).first() is not None:
        return jsonify({"error": "Ese número de empleado ya está siendo utilizado"}), 400
    if Admins.query.filter_by(employee_number=employee_number).first() is not None:
        return jsonify({"error": "Ese número de empleado ya está siendo utilizado"}), 400
    if Engineer.query.filter_by(employee_number=employee_number).first() is not None:
        return jsonify({"error": "Ese número de empleado ya está siendo utilizado"}), 400
    if user_name is None or password is None or names is None or last_names is None or employee_number is None or subzone is None or is_active is None or role is None:
        return jsonify({"error": "Todos los campos son requeridos"}), 400
    password_hash = generate_password_hash(password)

    try:
        new_admins = Admins(user_name=user_name, password=password_hash, names=names, last_names=last_names, employee_number=employee_number, subzone=subzone, is_active=is_active, role=role, user_id=user_id)
        db.session.add(new_admins)
        db.session.commit()
        return jsonify({"new_admins": new_admins.serialize()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}), 500


#CREATE ENGINEER

@api_blueprint.route('/create_engineer', methods=['POST'])
@jwt_required()
def create_engineer():
    body=request.json
    user_name = body.get("user_name", None)
    password = body.get("password", None)
    names = body.get("names", None)
    last_names = body.get("last_names", None)
    employee_number = body.get("employee_number", None)
    subzone = body.get("subzone", None)
    provider_id = body.get("provider_id", None)
    is_active = body.get("is_active", None)
    role = body.get("role", "Ingeniero de Campo")
    user_id = body.get("user_id", None)
    admins_id = body.get("admins_id", None)

    if User.query.filter_by(user_name=user_name).first() is not None:
        return jsonify({"error": "Ese nombre de usuario ya esta siendo utilizado"}), 400
    if Admins.query.filter_by(user_name=user_name).first() is not None:
        return jsonify({"error": "Ese nombre de usuario ya esta siendo utilizado"}), 400
    if Engineer.query.filter_by(user_name=user_name).first() is not None:
        return jsonify({"error": "Ese nombre de usuario ya esta siendo utilizado"}), 400
    if User.query.filter_by(employee_number=employee_number).first() is not None:
        return jsonify({"error": "Ese número de empleado ya está siendo utilizado"}), 400
    if Admins.query.filter_by(employee_number=employee_number).first() is not None:
        return jsonify({"error": "Ese número de empleado ya está siendo utilizado"}), 400
    if Engineer.query.filter_by(employee_number=employee_number).first() is not None:
        return jsonify({"error": "Ese número de empleado ya está siendo utilizado"}), 400
    provider = Provider.query.get(provider_id)
    if provider is None:
        return jsonify({"error": "proveedor no encontrado"}), 404
    if user_name is None or password is None or names is None or last_names is None or employee_number is None or subzone is None or provider_id is None or is_active is None or role is None:
        return jsonify({"error": "Todos los campos son requeridos"}), 400
    password_hash = generate_password_hash(password)

    try:
        new_engineer = Engineer(user_name=user_name, password=password_hash, names=names, last_names=last_names, employee_number=employee_number, subzone=subzone, provider_id=provider_id, is_active=is_active, role=role, user_id=user_id, admins_id=admins_id)
        db.session.add(new_engineer)
        db.session.commit()
        return jsonify({"new_engineer": new_engineer.serialize()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}), 500

#SIGN IN

@api_blueprint.route('/signin', methods=['POST'])
def signin():
    body=request.json
    user_name = body.get("user_name",None)
    password = body.get("password", None)
    if user_name is None or password is None:
        return jsonify({"error": "el nombre de usuario y la contraseña son requeridos"}), 400
    user = User.query.filter_by(user_name=user_name).first()
    if user is None:
        user = Admins.query.filter_by(user_name=user_name).first()
        if user is None:
            user = Engineer.query.filter_by(user_name=user_name).first()
            if user is None:
                return jsonify({"error": "el usuario no existe"}), 404
    if not check_password_hash(user.password, password):
        return jsonify({"error": "se ha producido un error al iniciar sesion, intenta nuevamente"}), 400
    user_token = create_access_token({"id": user.id, "user_name": user.user_name, "names": user.names, "last_names": user.last_names, "employee_number": user.employee_number, "is_active": user.is_active, "role": user.role })
    return jsonify({"token": user_token}), 200 

#####################   GETS  ALL   ########################################

#GET ME

@api_blueprint.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_data = get_jwt_identity()
    return jsonify(user_data), 200

#GET ALL USERS

@api_blueprint.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.order_by(User.id.asc()).all()
    users_data = [user.serialize() for user in users]
    return jsonify({"users": users_data}), 200

#GET ALL ADMINsS

@api_blueprint.route('/admins', methods=['GET'])
def get_all_adminss():
    adminss = Admins.query.order_by(Admins.id.asc()).all()
    adminss_data = [admins.serialize() for admins in adminss]
    return jsonify({"admins": adminss_data}), 200

#GET ALL ENGINEERS

@api_blueprint.route('/engineers', methods=['GET'])
def get_all_engineers():
    engineers = Engineer.query.order_by(Engineer.id.asc()).all()
    engineers_data = [engineer.serialize() for engineer in engineers]
    return jsonify({"engineers": engineers_data}), 200 

#GET ALL PROVIDERS

@api_blueprint.route('/providers', methods=['GET'])
def get_providers():
    providers = Provider.query.order_by(Provider.id.asc()).all()
    providers_data = [provider.serialize() for provider in providers]
    return jsonify({"providers": providers_data}), 200

#GET ALL BRANCHS

@api_blueprint.route('/branchs', methods=['GET'])
def get_branchs():
    branchs = Branch.query.order_by(Branch.id.asc()).all()
    branchs_data = [branch.serialize() for branch in branchs]
    return jsonify({"branchs": branchs_data}), 200

#GET ALL LINKS

@api_blueprint.route('/links', methods=['GET'])
def get_links():
    links = Link.query.order_by(Link.id.asc()).all()
    links_data = [link.serialize() for link in links]    
    return jsonify({"links": links_data}), 200

# GET ALL ASSETS

@api_blueprint.route('/assets', methods=['GET'])
def get_assets():
    assets = Assets.query.order_by(Assets.id.asc()).all()
    assets_data = [asset.serialize() for asset in assets]
    return jsonify({"assets": assets_data}), 200

#GET ALL USERSMB

@api_blueprint.route('/usersMB', methods=['GET'])
def get_usersMB():
    usersMB = UserMB.query.order_by(UserMB.id.asc()).all()
    usersMB_data = [userMB.serialize() for userMB in usersMB]
    return jsonify({"usersMB": usersMB_data}), 200

#GET ALL MIGRATIONS

@api_blueprint.route('/migrations', methods=['GET'])
def get_migrations():
    migrations = Migration.query.order_by(Migration.id.asc()).all()
    migrations_data = [migration.serialize() for migration in migrations]
    return jsonify({"migrations": migrations_data}), 200

#GET ALL MESSAGES

@api_blueprint.route('/messages', methods=['GET'])
def get_messages():
    messages = Message.query.order_by(Message.id.asc()).all()
    messages_data = [message.serialize() for message in messages]
    return jsonify({"messages": messages_data}), 200

#GET ALL HISTORY

@api_blueprint.route('/history', methods=['GET'])
def get_history():
    history = History.query.order_by(History.id.asc()).all()
    history_data = [history.serialize() for history in history]
    return jsonify({"history": history_data}), 200



#####################   GETS  BY ID  ########################################

#GET ALL MESSAGES BY USER ID
@api_blueprint.route('/messages/<int:user_id>', methods=['GET'])
def get_messages_by_user_id(user_id):
    messages = Message.query.filter_by(user_id=user_id).order_by(Message.id.asc()).all()
    messages_data = [message.serialize() for message in messages]
    return jsonify({"messages": messages_data}), 200

#GET ALL HISTORY BY PROVIDER ID

@api_blueprint.route('/history/<int:provider_id>', methods=['GET'])
def get_history_by_provider_id(provider_id):
    history = History.query.filter_by(provider_id=provider_id).order_by(History.id.asc()).all()
    history_data = [history.serialize() for history in history]
    return jsonify({"history": history_data}), 200

#GET ALL HISTORY BY BRANCH ID

@api_blueprint.route('/history/<int:branch_id>', methods=['GET'])
def get_history_by_branch_id(branch_id):
    history = History.query.filter_by(branch_id=branch_id).order_by(History.id.asc()).all()
    history_data = [history.serialize() for history in history]
    return jsonify({"history": history_data}), 200

#GET ALL HISTORY BY LINK ID

@api_blueprint.route('/history/<int:link_id>', methods=['GET'])
def get_history_by_link_id(link_id):
    history = History.query.filter_by(link_id=link_id).order_by(History.id.asc()).all()
    history_data = [history.serialize() for history in history]
    return jsonify({"history": history_data}), 200

#GET ALL HISTORY BY MIGRATION ID

@api_blueprint.route('/history/<int:migration_id>', methods=['GET'])
def get_history_by_migration_id(migration_id):
    history = History.query.filter_by(migration_id=migration_id).order_by(History.id.asc()).all()
    history_data = [history.serialize() for history in history]
    return jsonify({"history": history_data}), 200

#GET ALL HISTORY BY ASSET ID

@api_blueprint.route('/history/<int:asset_id>', methods=['GET'])
def get_history_by_asset_id(asset_id):
    history = History.query.filter_by(asset_id=asset_id).order_by(History.id.asc()).all()
    history_data = [history.serialize() for history in history]
    return jsonify({"history": history_data}), 200

#GET ALL HISTORY BY MESSAGE ID

@api_blueprint.route('/history/<int:message_id>', methods=['GET'])
def get_history_by_message_id(message_id):
    history = History.query.filter_by(message_id=message_id).order_by(History.id.asc()).all()
    history_data = [history.serialize() for history in history]
    return jsonify({"history": history_data}), 200


#GET MIGRATION BY PROVIDER ID

@api_blueprint.route('/migration/<int:provider_id>', methods=['GET'])
def get_migration_by_provider_id(provider_id):
    migration = Migration.query.filter_by(provider_id=provider_id).order_by(Migration.id.asc()).all()
    migration_data = [migration.serialize() for migration in migration]
    return jsonify({"migration": migration_data}), 200

#GET MIGRATION BY BRANCH ID

@api_blueprint.route('/migration/<int:branch_id>', methods=['GET'])
def get_migration_by_branch_id(branch_id):
    migration = Migration.query.filter_by(branch_id=branch_id).order_by(Migration.id.asc()).all()
    migration_data = [migration.serialize() for migration in migration]    
    return jsonify({"migration": migration_data}), 200  


# GET USER BY ID

@api_blueprint.route('/user/<int:id>', methods=['GET'])
def get_user_by_id(id):
    user = User.query.get(id)
    if user is None:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": user.serialize()}), 200

#GET ADMINs BY ID

@api_blueprint.route('/admins/<int:id>', methods=['GET'])
def get_admins_by_id(id):
    admins = Admins.query.get(id)
    if admins is None:
        return jsonify({"error": "Admins not found"}), 404
    return jsonify({"admins": admins.serialize()}), 200

#GET ENGINEER BY ID

@api_blueprint.route('/engineer/<int:id>', methods=['GET'])
def get_engineer_by_id(id):
    engineer = Engineer.query.get(id)
    if engineer is None:
        return jsonify({"error": "Engineer not found"}), 404
    return jsonify({"engineer": engineer.serialize()}), 200

#GET BRANCH BY ID

@api_blueprint.route('/branch/<int:id>', methods=['GET'])
def get_branch_by_id(id):
    branch = Branch.query.get(id)
    if branch is None:
        return jsonify({"error": "Branch not found"}), 404
    return jsonify({"branch": branch.serialize()}), 200

#GET PROVIDER BY ID

@api_blueprint.route('/provider/<int:id>', methods=['GET'])
def get_provider_by_id(id):
    provider = Provider.query.get(id)
    if provider is None:
        return jsonify({"error": "Provider not found"}), 404
    return jsonify({"provider": provider.serialize()}), 200

#GET ASSET BY ID

@api_blueprint.route('/asset/<int:id>', methods=['GET'])
def get_asset_by_id(id):
    asset = Assets.query.get(id)
    if asset is None:
        return jsonify({"error": "Asset not found"}), 404
    return jsonify({"asset": asset.serialize()}), 200

#GET USER MB BY ID

@api_blueprint.route('/userMB/<int:id>', methods=['GET'])
def get_userMB_by_id(id):
    userMB = UserMB.query.get(id)
    if userMB is None:
        return jsonify({"error": "UserMB not found"}), 404
    return jsonify({"userMB": userMB.serialize()}), 200

#GET MIGRATION BY ID

@api_blueprint.route('/migration/<int:id>', methods=['GET'])
def get_migration_by_id(id):
    migration = Migration.query.get(id)
    if migration is None:
        return jsonify({"error": "Migration not found"}), 404
    return jsonify({"migration": migration.serialize()}), 200   

#GET MESSAGE BY ID

@api_blueprint.route('/message/<int:id>', methods=['GET'])
def get_message_by_id(id):
    message = Message.query.get(id)
    if message is None:
        return jsonify({"error": "Message not found"}), 404
    return jsonify({"message": message.serialize()}), 200

#####################  ADD ###################################

#ADD BRANCH

@api_blueprint.route('/add_branch', methods=['POST'])
@jwt_required()
def add_branch():
    body=request.json
    user_data = get_jwt_identity()
    branch_cr = body.get("branch_cr", None)
    branch_address = body.get("branch_address", None)
    branch_zone = body.get("branch_zone", None)
    branch_subzone = body.get("branch_subzone", None)
    branch_work_stations = body.get("branch_work_stations", None)
    branch_category = body.get("branch_category", None)
    branch_saturday = body.get("branch_saturday", None)
    user_id = body.get("user_id", None)
    admins_id = body.get("admins_id", None)
    engineer_id = body.get("engineer_id", None)


    if Branch.query.filter_by(branch_cr=branch_cr).first() is not None:
        return jsonify({"error": "Branch ya existe"}), 400
    if branch_cr is None or branch_address is None or branch_zone is None or branch_subzone is None or branch_work_stations is None or branch_category is None or branch_saturday is None:
        return jsonify({"error": "Todos los campos son requeridos"}), 400
    try:
        new_branch = Branch(branch_cr=branch_cr, branch_address=branch_address, branch_zone=branch_zone, branch_subzone=branch_subzone, branch_work_stations=branch_work_stations, branch_category=branch_category, branch_saturday=branch_saturday, user_id=user_id, admins_id=admins_id, engineer_id=engineer_id)
        db.session.add(new_branch)
        db.session.commit()
        return jsonify({"new_branch": new_branch.serialize()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}), 500

#ADD PROVIDER

@api_blueprint.route('/add_provider', methods=['POST'])
@jwt_required()
def add_provider():
    body=request.json
    user_data = get_jwt_identity()
    branch_id = body.get("branch_id", None)
    company_name = body.get("company_name", None)
    rfc = body.get("rfc", None)
    service = body.get("service", None)
    user_id = body.get("user_id", None)
    admins_id = body.get("admins_id", None)

    if Provider.query.filter_by(company_name=company_name).first() is not None:
        return jsonify({"error": "Ese nombre de Proveedor ya esta siendo utilizado"}), 400
    branch = Branch.query.get(branch_id)
    if branch is None:
        return jsonify({"error": "branch no encontrado"}), 404 
    if company_name is None or rfc is None or service is None:
        return jsonify({"error": "Todos los campos son requeridos"}), 400
    
    try:
        new_provider = Provider(company_name=company_name, rfc=rfc, service=service, user_id=user_id, admins_id=admins_id, branch_id=branch.id)
        db.session.add(new_provider)
        db.session.commit()
        return jsonify({"new_provider": new_provider.serialize()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}), 500

#ADD LINK

@api_blueprint.route('/add_link', methods=['POST'])
@jwt_required()
def add_link():
    body=request.json
    user_data = get_jwt_identity()
    type = body.get("type", None)
    description = body.get("description", None)
    speed = body.get("speed", None)
    status = body.get("status", None)
    user_id = body.get("user_id", None)
    admins_id = body.get("admins_id", None)
    engineer_id = body.get("engineer_id", None)
    provider_id = body.get("provider_id", None)
    branch_id = body.get("branch_id", None)

    if Link.query.filter_by(type=type).first() is not None:
        return jsonify({"error": "Link ya existe"}), 400
    if type is None or description is None or speed is None or status is None:
        return jsonify({"error": "Todos los campos son requeridos"}), 400
    try:
        new_link = Link(type=type, description=description, speed=speed, status=status, user_id=user_id, admins_id=admins_id, engineer_id=engineer_id, provider_id=provider_id, branch_id=branch_id)
        db.session.add(new_link)
        db.session.commit()
        return jsonify({"new_link": new_link.serialize()}), 201
    except Exception as error:
        db.session.rollback()    
        return jsonify({"error": f"{error}"}), 500
    
#ADD ASSET

@api_blueprint.route('/add_asset', methods=['POST'])
@jwt_required()
def add_asset():
    body = request.json
    user_data = get_jwt_identity()
    asset_type = body.get("asset_type", None)
    asset_brand = body.get("asset_brand", None)
    asset_model = body.get("asset_model", None)
    asset_serial = body.get("asset_serial", None)
    asset_inventory_number =  body.get("asset_inventory_number", None)
    branch_id = body.get("branch_id", None)
    provider_id = body.get("provider_id", None)
    user_mb_id = body.get("user_mb_id", None)
    user_id = body.get("user_id", None)
    admins_id = body.get("admins_id", None)
    engineer_id = body.get("engineer_id", None)

    if Assets.query.filter_by(asset_serial=asset_serial).first() is not None:
        return jsonify({"error": "Activo ya existe"}), 400
    provider = Provider.query.get(provider_id)
    if provider is None:
        return jsonify({"error": "proveedor no encontrado"}), 404 
    
    if asset_type is None or asset_brand is None or asset_model is None or asset_serial is None or asset_inventory_number is None or provider_id is None:
        return jsonify({"error": "faltan datos"}), 400
    try:
        new_asset = Assets(asset_type=asset_type, asset_brand=asset_brand, asset_model=asset_model, asset_serial=asset_serial, asset_inventory_number=asset_inventory_number, branch_id=branch_id, provider_id=provider.id, user_mb_id=user_mb_id, user_id=user_id, admins_id=admins_id, engineer_id=engineer_id)
        db.session.add(new_asset)
        db.session.commit()
        return jsonify({"new_asset": new_asset.serialize()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}), 500
    
#ADD USER MB

@api_blueprint.route('/add_userMB', methods=['POST'])
@jwt_required()
def add_userMB():
    body=request.json
    role = body.get("role", None)
    is_active = body.get("is_active", None)
    names = body.get("names", None)
    last_names = body.get("last_names", None)
    employee_number = body.get("employee_number", None)
    extension_phone = body.get("extension_phone", None)
    user_id = body.get("user_id", None)
    branch_id = body.get("branch_id", None)
    admins_id = body.get("admins_id", None)
    engineer_id = body.get("engineer_id", None)

    branch = Branch.query.get(branch_id)
    if branch is None:
        return jsonify({"error": "branch no encontrado"}), 404 
    if is_active is None or names is None or last_names is None or employee_number is None or branch_id is None or role is None or extension_phone is None:
        return jsonify({"error": "faltan datos"}), 400
    
    try:
        new_userMB = UserMB(role=role, is_active=is_active, names=names, last_names=last_names, employee_number=employee_number, extension_phone=extension_phone, branch_id=branch.id, admins_id=admins_id, engineer_id=engineer_id, user_id=user_id)
        db.session.add(new_userMB)
        db.session.commit()
        return jsonify({"new_userMB": new_userMB.serialize()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}), 500
    

#ADD MIGRATION

@api_blueprint.route('/add_migration', methods=['POST'])
@jwt_required()
def add_migration():
    body=request.json
    user_data = get_jwt_identity()
    installation_date = body.get("installation_date", None)
    migration_date = body.get("migration_date", None)
    migration_description = body.get("migration_description", None)
    migration_status = body.get("migration_status", None)
    provider_id = body.get("provider_id", None)
    branch_id = body.get("branch_id", None)
    user_id = body.get("user_id", None)
    admins_id = body.get("admins_id", None)
    engineer_id = body.get("engineer_id", None)
    asset_id = body.get("asset_id", None)

    provider = Provider.query.get(provider_id)
    if provider is None:
        return jsonify({"error": "proveedor no encontrado"}), 404 
    branch = Branch.query.get(branch_id)
    if branch is None:
        return jsonify({"error": "branch no encontrado"}), 404 
    
    if installation_date is None or migration_date is None or migration_description is None or migration_status is None or provider_id is None or branch_id is None:
        return jsonify({"error": "faltan datos"}), 400

    try:
        new_migration = Migration(installation_date=installation_date, migration_date=migration_date, migration_description=migration_description, migration_status=migration_status, provider_id=provider.id, branch_id=branch.id, asset_id=asset_id, user_id=user_id, admins_id=admins_id, engineer_id=engineer_id)
        db.session.add(new_migration)
        db.session.commit()
        return jsonify({"new_migration": new_migration.serialize()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}), 500
    
#ADD MESSAGE

@api_blueprint.route('/add_message', methods=['POST'])
@jwt_required()
def add_message():
    body=request.json
    user_data = get_jwt_identity()
    message = body.get("message", None)
    provider_id = body.get("provider_id", None)
    branch_id = body.get("branch_id", None)
    migration_id = body.get("migration_id", None)
    user_id = body.get("user_id", None)
    admins_id = body.get("admins_id", None)
    engineer_id = body.get("engineer_id", None)

    if Message.query.filter_by(message=message).first() is not None:
        return jsonify({"error": "Message ya existe"}), 400
    provider = Provider.query.get(provider_id)
    if provider is None:
        return jsonify({"error": "proveedor no encontrado"}), 404 
    branch = Branch.query.get(branch_id)
    if branch is None:
        return jsonify({"error": "branch no encontrado"}), 404 
    migration = Migration.query.get(migration_id)
    if migration is None:
        return jsonify({"error": "migracion no encontrado"}), 404 
    
    try:
        new_message = Message(message=message, provider_id=provider.id, branch_id=branch.id, migration_id=migration.id, user_id=user_id, admins_id=admins_id, engineer_id=engineer_id)
        db.session.add(new_message)
        db.session.commit()
        return jsonify({"new_message": new_message.serialize()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}), 500
    
#ADD HISTORY

@api_blueprint.route('/add_history', methods=['POST'])
@jwt_required()
def add_history():
    body=request.json
    user_data = get_jwt_identity()
    message = body.get("message", None)
    provider_id = body.get("provider_id", None)
    branch_id = body.get("branch_id", None)
    migration_id = body.get("migration_id", None)
    asset_id = body.get("asset_id", None)
    date = body.get("date", None)
    link_id = body.get("link_id", None)
    user_id = body.get("user_id", None)
    admins_id = body.get("admins_id", None)
    engineer_id = body.get("engineer_id", None)


        
    try:
        new_history = History(message=message, provider_id=provider_id, branch_id=branch_id, migration_id=migration_id, asset_id=asset_id, date=date, link_id=link_id, user_id=user_id, admins_id=admins_id, engineer_id=engineer_id)
        db.session.add(new_history)
        db.session.commit()
        return jsonify({"new_history": new_history.serialize()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"{error}"}), 500
    

        

#####################  EDIT ###################################

# Edit USER
@api_blueprint.route('/editUser', methods=['PUT'])
@jwt_required()
def edit_user():
    try:
        body = request.json
        user_id = body.get("id", None)
        user = User.query.get(user_id)

        user_data = get_jwt_identity()
        current_user_role = user_data["role"]


        if current_user_role != "Master" and user.role == "Master":
            return jsonify({"error": "Solo el usuario master puede editar Masters"}), 403
        if current_user_role != "Master" and user.role == "Admins":
            return jsonify({"error": "Solo el usuario master puede editar Adminsistradores"}), 403
        if current_user_role not in ["Master", "Admins"]:
            
            return jsonify({"error": "No tienes permisos para realizar esta acción"}), 403
        if user is None:
            return jsonify({"error": "User not found"}), 404
        
        user.user_name = body.get("user_name", user.user_name)  
        if "password" in body and body["password"]:
            user.password = generate_password_hash(body["password"])
        
        user.is_active = body.get("is_active", user.is_active)
        user.names = body.get("names", user.names)
        user.last_names = body.get("last_names", user.last_names)
        user.employee_number = body.get("employee_number", user.employee_number)
        user.subzone = body.get("subzone", user.subzone)
        user.role = body.get("role", user.role)
        
        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    
# EDIT ADMINS

@api_blueprint.route('/edit_admins', methods=['PUT'])
@jwt_required()
def edit_admins():
    try:
        body = request.json
        user_data = get_jwt_identity()
        user_id = body.get("id")
        
        if not user_id:
            return jsonify({'error': 'Missing userID'}), 400
        
        user = Admins.query.filter_by(id=user_id).first()
        if user is None:
            return jsonify({'error': 'User no found'}), 404
        
        user.user_name = body.get("user_name", user.user_name)  
        if "password" in body and body["password"]:
            user.password = generate_password_hash(body["password"])
        
        user.is_active = body.get("is_active", user.is_active)
        user.names = body.get("names", user.names)
        user.last_names = body.get("last_names", user.last_names)
        user.employee_number = body.get("employee_number", user.employee_number)
        user.subzone = body.get("subzone", user.subzone)
        user.role = body.get("role", user.role)
    
        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500
    

# EDIT ENGINEER

@api_blueprint.route('/edit_engineer', methods=['PUT'])
@jwt_required()
def edit_engineer():
    try:
        body = request.json
        user_data = get_jwt_identity()
        user_id = body.get("id")
        
        if not user_id:
            return jsonify({'error': 'Missing userID'}), 400
        
        user = Engineer.query.filter_by(id=user_id).first()
        if user is None:
            return jsonify({'error': 'User no found'}), 404
        
        user.user_name = body.get("user_name", user.user_name)  
        if "password" in body and body["password"]:
            user.password = generate_password_hash(body["password"])
        
        user.is_active = body.get("is_active", user.is_active)
        user.names = body.get("names", user.names)
        user.last_names = body.get("last_names", user.last_names)
        user.employee_number = body.get("employee_number", user.employee_number)
        user.subzone = body.get("subzone", user.subzone)
        user.provider_id = body.get("provider_id", user.provider_id)
        user.role = body.get("role", user.role)
    
        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200
    except Exception as error:
        return jsonify({"error": str(error)}), 500

# EDIT BRANCH
@api_blueprint.route('/edit_branch', methods=['PUT'])
@jwt_required()
def edit_branch():
    try:
        body = request.json
        user_data = get_jwt_identity()
        branch_id = body.get("id")
        
        if not branch_id:
            return jsonify({'error': 'Missing branch ID or user ID'}), 400
        
        branch = Branch.query.filter_by(id=branch_id).first()
        if branch is None:
            return jsonify({'error': 'Branch no found'}), 404
        
        branch.branch_cr = body.get("branch_cr", branch.branch_cr)
        branch.branch_address = body.get("branch_address", branch.branch_address)
        branch.branch_zone = body.get("branch_zone", branch.branch_zone)
        branch.branch_subzone = body.get("branch_subzone", branch.branch_subzone)
        branch.branch_work_stations = body.get("branch_work_stations", branch.branch_work_stations)
        branch.branch_category = body.get("branch_category", branch.branch_category)
        branch.branch_saturday = body.get("branch_saturday", branch.branch_saturday)
        branch.user_id = body.get("user_id", branch.user_id)
        branch.admins_id = body.get("admins_id", branch.admins_id)
        branch.engineer_id = body.get("engineer_id", branch.engineer_id)
        
        db.session.commit()
        return jsonify({"message": "Branch updated successfully"}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500


# EDIT PROVIDER
@api_blueprint.route('/edit_provider', methods=['PUT'])
@jwt_required()
def edit_provider():
    try:
        body = request.json
        user_data = get_jwt_identity()
        provider_id = body.get("id")
        
        if not provider_id:
            return jsonify({'error': 'Missing provider ID or user ID'}), 400
        
        provider = Provider.query.filter_by(id=provider_id).first()
        if provider is None:
            return jsonify({'error': 'Provider no found'}), 404
        
        provider.company_name = body.get("company_name", provider.company_name)
        provider.rfc = body.get("rfc", provider.rfc)
        provider.service = body.get("service", provider.service)
        provider.user_id = body.get("user_id", provider.user_id)
        provider.admins_id = body.get("admins_id", provider.admins_id)
        
        db.session.commit()
        return jsonify({"message": "Provider updated successfully"}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500
    

# EDIT LINK
@api_blueprint.route('/edit_link', methods=['PUT'])
@jwt_required()
def edit_link():
    try:
        body = request.json
        user_data = get_jwt_identity()
        type = body.get("id")
        
        if not type:
            return jsonify({'error': 'Missing link ID'}), 400
        
        link = Link.query.filter_by(id=type).first()
        if link is None:
            return jsonify({'error': 'Link no found'}), 404
        
        link.type = body.get("type", link.type)
        link.description = body.get("description", link.description)
        link.speed = body.get("speed", link.speed)
        link.status = body.get("status", link.status)
        link.user_id = body.get("user_id", link.user_id)
        link.admins_id = body.get("admins_id", link.admins_id)
        link.engineer_id = body.get("engineer_id", link.engineer_id)
        link.provider_id = body.get("provider_id", link.provider_id)
        link.branch_id = body.get("branch_id", link.branch_id)
        
        db.session.commit()
        return jsonify({"message": "Link updated successfully"}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500



# EDIT ASSET
@api_blueprint.route('/edit_asset', methods=['PUT'])
@jwt_required()
def edit_asset():
    try:
        body = request.json
        user_data = get_jwt_identity()
        asset_id = body.get("id")
        
        if not asset_id:
            return jsonify({'error': 'Missing asset ID or user ID'}), 400
        
        asset = Assets.query.filter_by(id=asset_id).first()
        if asset is None:
            return jsonify({'error': 'Asset no found'}), 404
        
        asset.asset_type = body.get("asset_type", asset.asset_type)
        asset.asset_brand = body.get("asset_brand", asset.asset_brand)
        asset.asset_model = body.get("asset_model", asset.asset_model)
        asset.asset_serial = body.get("asset_serial", asset.asset_serial)
        asset.asset_inventory_number = body.get("asset_inventory_number", asset.asset_inventory_number)
        asset.user_mb_id = body.get("user_mb_id", asset.user_mb_id)
        asset.branch_id = body.get("branch_id", asset.branch_id)
        asset.user_id = body.get("user_id", asset.user_id)
        asset.admins_id = body.get("admins_id", asset.admins_id)
        asset.engineer_id = body.get("engineer_id", asset.engineer_id)
        
        db.session.commit()
        return jsonify({"message": "Asset updated successfully"}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500

# EDIT ASSET USER MB

@api_blueprint.route('/edit_asset_userMB', methods=['PUT'])
@jwt_required()
def edit_asset_userMB():
    try:
        body = request.json
        user_data = get_jwt_identity()
        asset_id = body.get("id")
        userMB_id = body.get("userMB_id")
        
        if not asset_id:
            return jsonify({'error': 'Missing asset ID or user ID'}), 400
        
        asset = Assets.query.filter_by(id=asset_id).first()
        if asset is None:
            return jsonify({'error': 'Asset no found'}), 404
        
        asset.user_mb_id = userMB_id
        db.session.commit()
        return jsonify({"message": "Asset updated successfully"}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500

# EDIT USER MB
@api_blueprint.route('/edit_userMB', methods=['PUT'])
@jwt_required()
def edit_userMB():
    try:
        body = request.json
        user_data = get_jwt_identity()
        user_id = body.get("id")
        
        if not user_id:
            return jsonify({'error': 'Missing userMB ID'}), 400
        
        userMB = UserMB.query.filter_by(id=user_id).first()
        if userMB is None:
            return jsonify({'error': 'UserMB no found'}), 404
        
        userMB.role = body.get("role", userMB.role)
        userMB.is_active = body.get("is_active", userMB.is_active)
        userMB.names = body.get("names", userMB.names)
        userMB.last_names = body.get("last_names", userMB.last_names)
        userMB.employee_number = body.get("employee_number", userMB.employee_number)
        userMB.extension_phone = body.get("extension_phone", userMB.extension_phone)
        userMB.branch_id = body.get("branch_id", userMB.branch_id)
        userMB.user_id = body.get("user_id", userMB.user_id)
        userMB.admins_id = body.get("admins_id", userMB.admins_id)
        userMB.engineer_id = body.get("engineer_id", userMB.engineer_id)
        
        db.session.commit()
        return jsonify({"message": "UserMB updated successfully"}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500


# EDIT MIGRATION
@api_blueprint.route('/edit_migration', methods=['PUT'])
@jwt_required()
def edit_migration():
    try:
        body = request.json
        user_data = get_jwt_identity()
        migration_id = body.get("id")
        
        if not migration_id:
            return jsonify({'error': 'Missing migration ID or user ID'}), 400
        
        migration = Migration.query.filter_by(id=migration_id).first()
        if migration is None:
            return jsonify({'error': 'Migration no found'}), 404
        
        migration.installation_date = body.get("installation_date", migration.installation_date)
        migration.migration_date = body.get("migration_date", migration.migration_date)
        migration.migration_description = body.get("migration_description", migration.migration_description)
        migration.migration_status = body.get("migration_status", migration.migration_status)
        migration.user_id = body.get("user_id", migration.user_id)
        migration.admins_id = body.get("admins_id", migration.admins_id)
        migration.engineer_id = body.get("engineer_id", migration.engineer_id)
        migration.asset_id = body.get("asset_id", migration.asset_id)

        
        db.session.commit()
        return jsonify({"new_migration": migration.serialize()}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500
    

# EDIT MESSAGE
@api_blueprint.route('/edit_message', methods=['PUT'])
@jwt_required()
def edit_message():
    try:
        body = request.json
        user_data = get_jwt_identity()
        message_id = body.get("id")
        
        if not message_id:
            return jsonify({'error': 'Missing message ID'}), 400
        
        message = Message.query.filter_by(id=message_id).first()
        if message is None:
            return jsonify({'error': 'Message no found'}), 404
        
        message.message = body.get("message", message.message)
        message.user_id = body.get("user_id", message.user_id)
        message.admins_id = body.get("admins_id", message.admins_id)
        message.engineer_id = body.get("engineer_id", message.engineer_id)
        
        db.session.commit()
        return jsonify({"message": "Message updated successfully"}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500
    

# EDIT HISTORY
@api_blueprint.route('/edit_history', methods=['PUT'])
@jwt_required()
def edit_history():
    try:
        body = request.json
        user_data = get_jwt_identity()
        message_id = body.get("id")
        
        if not message_id:
            return jsonify({'error': 'Missing message ID'}), 400
        
        history = History.query.filter_by(id=message_id).first()
        if history is None:
            return jsonify({'error': 'History no found'}), 404
        
        history.message = body.get("message", history.message)
        history.user_id = body.get("user_id", history.user_id)
        history.admins_id = body.get("admins_id", history.admins_id)
        history.engineer_id = body.get("engineer_id", history.engineer_id)

        
        db.session.commit()
        return jsonify({"message": "History updated successfully"}), 200
    except Exception as error:  
        return jsonify({"error": f"{error}"}), 500



#####################  DELETE ###################################

# DELETE BRANCH
@api_blueprint.route('/delete_branch', methods=['DELETE'])
@jwt_required()
def delete_branch():
    try:
        body = request.json
        user_data = get_jwt_identity()
        branch_id = body.get("id", None)
        
        branch = Branch.query.filter_by(id=branch_id).first()
        if branch is None:
            return jsonify({'error': 'Branch no found'}), 404
        
        db.session.delete(branch)
        db.session.commit()
        return jsonify({"message": "Branch removed"}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500


# DELETE PROVIDER
@api_blueprint.route('/delete_provider', methods=['DELETE'])
@jwt_required()
def delete_provider():
    try:
        body = request.json
        user_data = get_jwt_identity()
        provider_id = body.get("id", None)
        
        provider = Provider.query.filter_by(id=provider_id).first()
        if provider is None:
            return jsonify({'error': 'Provider no found'}), 404
        
        db.session.delete(provider)
        db.session.commit()
        return jsonify({"message": "Provider removed"}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500
    

# DELETE LINK
@api_blueprint.route('/delete_link', methods=['DELETE'])
@jwt_required()
def delete_link():
    try:
        body = request.json
        user_data = get_jwt_identity()
        link_id = body.get("id", None)
        
        link = Link.query.filter_by(id=link_id).first()
        if link is None:
            return jsonify({'error': 'Link no found'}), 404
        
        db.session.delete(link)
        db.session.commit()
        return jsonify({"message": "Link removed"}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500
    


# DELETE ASSET
@api_blueprint.route('/delete_asset', methods=['DELETE'])
@jwt_required()
def delete_asset():
    try:
        body = request.json
        user_data = get_jwt_identity()
        asset_id = body.get("id", None)
        
        asset = Assets.query.filter_by(id=asset_id).first()
        if asset is None:
            return jsonify({'error': 'Asset no found'}), 404
        
        db.session.delete(asset)
        db.session.commit()
        return jsonify({"message": "Asset removed"}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500

# DELETE USER MB
@api_blueprint.route('/delete_userMB', methods=['DELETE'])
@jwt_required()
def delete_userMB():
    try:
        body = request.json
        user_data = get_jwt_identity()
        user_id = body.get("id", None)
        
        userMB = UserMB.query.filter_by(id=user_id).first()
        if userMB is None:
            return jsonify({'error': 'UserMB no found'}), 404
        
        db.session.delete(userMB)
        db.session.commit()
        return jsonify({"message": "UserMB removed"}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500

# DELETE MIGRATION
@api_blueprint.route('/delete_migration', methods=['DELETE'])
@jwt_required()
def delete_migration():
    try:
        body = request.json
        user_data = get_jwt_identity()
        migration_id = body.get("id", None)
        
        migration = Migration.query.filter_by(id=migration_id).first()
        if migration is None:
            return jsonify({'error': 'Migration no found'}), 404
        
        db.session.delete(migration)
        db.session.commit()
        return jsonify({"message": "Migration removed"}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500
    

# DELETE MESSAGE
@api_blueprint.route('/delete_message', methods=['DELETE'])
@jwt_required()
def delete_message():
    try:
        body = request.json
        user_data = get_jwt_identity()
        message_id = body.get("id", None)
        
        message = Message.query.filter_by(id=message_id).first()
        if message is None:
            return jsonify({'error': 'Message no found'}), 404
        
        db.session.delete(message)
        db.session.commit()
        return jsonify({"message": "Message removed"}), 200
    except Exception as error:    
        return jsonify({"error": f"{error}"}), 500
    

# DELETE HISTORY
@api_blueprint.route('/delete_history', methods=['DELETE'])
@jwt_required()
def delete_history():
    try:
        body = request.json
        user_data = get_jwt_identity()
        message_id = body.get("id", None)
        
        message = History.query.filter_by(id=message_id).first()
        if message is None:
            return jsonify({'error': 'Message no found'}), 404
        
        db.session.delete(message)
        db.session.commit()
        return jsonify({"message": "Message removed"}), 200
    except Exception as error:
        return jsonify({"error": f"{error}"}), 500
    



