from flask import Blueprint, jsonify, request
from backend.models import User, Provider, Branch, Assets, UserMB, Migration
from backend.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt


api_blueprint = Blueprint('api', __name__)


#####################   USERS SECTION    ########################################

#CREATE ADMIN TOKEN FUNCTION#
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
    if current_user_role != "Master" and role == "Admin":
        return jsonify({"error": "Solo el usuario master puede crear Administradores"}), 403
    if current_user_role not in ["Master", "Admin"]:
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

#####################   GETS  BY ID  ########################################

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

    if Branch.query.filter_by(branch_cr=branch_cr).first() is not None:
        return jsonify({"error": "Branch ya existe"}), 400
    if branch_cr is None or branch_address is None or branch_zone is None or branch_subzone is None:
        return jsonify({"error": "Todos los campos son requeridos"}), 400
    try:
        new_branch = Branch(branch_cr=branch_cr, branch_address=branch_address, branch_zone=branch_zone, branch_subzone=branch_subzone, user_id=user_data["id"])
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

    if Provider.query.filter_by(company_name=company_name).first() is not None:
        return jsonify({"error": "Ese nombre de Proveedor ya esta siendo utilizado"}), 400
    branch = Branch.query.get(branch_id)
    if branch is None:
        return jsonify({"error": "branch no encontrado"}), 404 
    if company_name is None or rfc is None or service is None:
        return jsonify({"error": "Todos los campos son requeridos"}), 400
    
    try:
        new_provider = Provider(company_name=company_name, rfc=rfc, service=service, user_id=user_data["id"], branch_id=branch.id)
        db.session.add(new_provider)
        db.session.commit()
        return jsonify({"new_provider": new_provider.serialize()}), 201
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
    migration_id = body.get("migration_id", None)
    provider_id = body.get("provider_id", None)

    if Assets.query.filter_by(asset_serial=asset_serial).first() is not None:
        return jsonify({"error": "Activo ya existe"}), 400
    provider = Provider.query.get(provider_id)
    if provider is None:
        return jsonify({"error": "proveedor no encontrado"}), 404 
    
    if asset_type is None or asset_brand is None or asset_model is None or asset_serial is None or asset_inventory_number is None or provider_id is None:
        return jsonify({"error": "faltan datos"}), 400
    try:
        new_asset = Assets(asset_type=asset_type, asset_brand=asset_brand, asset_model=asset_model, asset_serial=asset_serial, asset_inventory_number=asset_inventory_number, branch_id=branch_id, migration_id=migration_id, provider_id=provider.id, user_id=user_data["id"])
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
    user_name_MB = body.get("user_name_MB", None)
    is_active = body.get("is_active", None)
    names = body.get("names", None)
    last_names = body.get("last_names", None)
    employee_number = body.get("employee_number", None)
    branch_id = body.get("branch_id", None)
    asset_id = body.get("asset_id", None)

    if UserMB.query.filter_by(user_name_MB=user_name_MB).first() is not None:
        return jsonify({"error": "usuarioMB ya existe"}), 400
    branch = Branch.query.get(branch_id)
    if branch is None:
        return jsonify({"error": "branch no encontrado"}), 404 
    asset = Assets.query.get(asset_id)
    if asset is None:
        return jsonify({"error": "activo no encontrado"}), 404
    if user_name_MB is None or is_active is None or names is None or last_names is None or employee_number is None or branch_id is None or asset_id is None:
        return jsonify({"error": "faltan datos"}), 400
    
    try:
        new_userMB = UserMB(user_name_MB=user_name_MB, is_active=is_active, names=names, last_names=last_names, employee_number=employee_number, branch_id=branch.id, asset_id=asset.id)
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

    provider = Provider.query.get(provider_id)
    if provider is None:
        return jsonify({"error": "proveedor no encontrado"}), 404 
    branch = Branch.query.get(branch_id)
    if branch is None:
        return jsonify({"error": "branch no encontrado"}), 404 
    
    if installation_date is None or migration_date is None or migration_description is None or migration_status is None or provider_id is None or branch_id is None:
        return jsonify({"error": "faltan datos"}), 400

    try:
        new_migration = Migration(installation_date=installation_date, migration_date=migration_date, migration_description=migration_description, migration_status=migration_status, provider_id=provider.id, branch_id=branch.id, user_id=user_data["id"])
        db.session.add(new_migration)
        db.session.commit()
        return jsonify({"new_migration": new_migration.serialize()}), 201
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
        if current_user_role != "Master" and user.role == "Admin":
            return jsonify({"error": "Solo el usuario master puede editar Administradores"}), 403
        if current_user_role not in ["Master", "Admin"]:
            
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


# EDIT BRANCH
@api_blueprint.route('/edit_branch', methods=['PUT'])
@jwt_required()
def edit_branch():
    try:
        body = request.json
        user_data = get_jwt_identity()
        branch_id = body.get("id")
        user_id = user_data["id"]
        
        if not branch_id or not user_id:
            return jsonify({'error': 'Missing branch ID or user ID'}), 400
        
        branch = Branch.query.filter_by(id=branch_id, user_id=user_id).first()
        if branch is None:
            return jsonify({'error': 'Branch no found'}), 404
        
        branch.branch_cr = body.get("branch_cr", branch.branch_cr)
        branch.branch_address = body.get("branch_address", branch.branch_address)
        branch.branch_zone = body.get("branch_zone", branch.branch_zone)
        branch.branch_subzone = body.get("branch_subzone", branch.branch_subzone)
        
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
        user_id = user_data["id"]
        
        if not provider_id or not user_id:
            return jsonify({'error': 'Missing provider ID or user ID'}), 400
        
        provider = Provider.query.filter_by(id=provider_id, user_id=user_id).first()
        if provider is None:
            return jsonify({'error': 'Provider no found'}), 404
        
        provider.company_name = body.get("company_name", provider.company_name)
        provider.rfc = body.get("rfc", provider.rfc)
        provider.service = body.get("service", provider.service)
        
        db.session.commit()
        return jsonify({"message": "Provider updated successfully"}), 200
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
        user_id = user_data["id"]
        
        if not asset_id or not user_id:
            return jsonify({'error': 'Missing asset ID or user ID'}), 400
        
        asset = Assets.query.filter_by(id=asset_id, user_id=user_id).first()
        if asset is None:
            return jsonify({'error': 'Asset no found'}), 404
        
        asset.asset_type = body.get("asset_type", asset.asset_type)
        asset.asset_brand = body.get("asset_brand", asset.asset_brand)
        asset.asset_model = body.get("asset_model", asset.asset_model)
        asset.asset_serial = body.get("asset_serial", asset.asset_serial)
        asset.asset_inventory_number = body.get("asset_inventory_number", asset.asset_inventory_number)
        
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
        
        userMB.user_name_MB = body.get("user_name_MB", userMB.user_name_MB)
        userMB.is_active = body.get("is_active", userMB.is_active)
        userMB.names = body.get("names", userMB.names)
        userMB.last_names = body.get("last_names", userMB.last_names)
        userMB.employee_number = body.get("employee_number", userMB.employee_number)
        userMB.branch_id = body.get("branch_id", userMB.branch_id)
        userMB.asset_id = body.get("asset_id", userMB.asset_id) 
        
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
        user_id = user_data["id"]
        
        if not migration_id or not user_id:
            return jsonify({'error': 'Missing migration ID or user ID'}), 400
        
        migration = Migration.query.filter_by(id=migration_id, user_id=user_id).first()
        if migration is None:
            return jsonify({'error': 'Migration no found'}), 404
        
        migration.installation_date = body.get("installation_date", migration.installation_date)
        migration.migration_date = body.get("migration_date", migration.migration_date)
        migration.migration_description = body.get("migration_description", migration.migration_description)
        migration.migration_status = body.get("migration_status", migration.migration_status)
        
        db.session.commit()
        return jsonify({"message": "Migration updated successfully"}), 200
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
