"""empty message

Revision ID: 6af23c398507
Revises: 
Create Date: 2024-11-05 14:45:24.751351

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6af23c398507'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_name', sa.String(length=30), nullable=False),
    sa.Column('password', sa.String(length=180), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('names', sa.String(length=50), nullable=False),
    sa.Column('last_names', sa.String(length=50), nullable=False),
    sa.Column('employee_number', sa.String(length=20), nullable=False),
    sa.Column('subzone', sa.String(length=50), nullable=False),
    sa.Column('role', sa.String(length=50), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('employee_number'),
    sa.UniqueConstraint('user_name')
    )
    op.create_table('admins',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_name', sa.String(length=50), nullable=False),
    sa.Column('password', sa.String(length=180), nullable=False),
    sa.Column('names', sa.String(length=50), nullable=False),
    sa.Column('last_names', sa.String(length=50), nullable=False),
    sa.Column('employee_number', sa.String(length=50), nullable=False),
    sa.Column('subzone', sa.String(length=50), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('role', sa.String(length=50), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('user_name')
    )
    op.create_table('engineer',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_name', sa.String(length=50), nullable=False),
    sa.Column('password', sa.String(length=180), nullable=False),
    sa.Column('names', sa.String(length=50), nullable=False),
    sa.Column('last_names', sa.String(length=50), nullable=False),
    sa.Column('employee_number', sa.String(length=50), nullable=False),
    sa.Column('subzone', sa.String(length=50), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('role', sa.String(length=50), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('admins_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['admins_id'], ['admins.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('user_name')
    )
    op.create_table('branch',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('branch_cr', sa.String(length=50), nullable=False),
    sa.Column('branch_address', sa.String(length=50), nullable=False),
    sa.Column('branch_zone', sa.String(length=50), nullable=False),
    sa.Column('branch_subzone', sa.String(length=50), nullable=False),
    sa.Column('branch_work_stations', sa.String(length=50), nullable=False),
    sa.Column('branch_category', sa.String(length=50), nullable=False),
    sa.Column('branch_saturday', sa.String(length=50), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('admins_id', sa.Integer(), nullable=True),
    sa.Column('engineer_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['admins_id'], ['admins.id'], ),
    sa.ForeignKeyConstraint(['engineer_id'], ['engineer.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('branch_cr')
    )
    op.create_table('provider',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('company_name', sa.String(length=50), nullable=False),
    sa.Column('rfc', sa.String(length=30), nullable=False),
    sa.Column('service', sa.String(length=50), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('admins_id', sa.Integer(), nullable=True),
    sa.Column('engineer_id', sa.Integer(), nullable=True),
    sa.Column('branch_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['admins_id'], ['admins.id'], ),
    sa.ForeignKeyConstraint(['branch_id'], ['branch.id'], ),
    sa.ForeignKeyConstraint(['engineer_id'], ['engineer.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('rfc')
    )
    op.create_table('migration',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('installation_date', sa.Date(), nullable=False),
    sa.Column('migration_date', sa.Date(), nullable=False),
    sa.Column('migration_description', sa.String(length=250), nullable=False),
    sa.Column('migration_status', sa.String(length=50), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('provider_id', sa.Integer(), nullable=True),
    sa.Column('admins_id', sa.Integer(), nullable=True),
    sa.Column('engineer_id', sa.Integer(), nullable=True),
    sa.Column('branch_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['admins_id'], ['admins.id'], ),
    sa.ForeignKeyConstraint(['branch_id'], ['branch.id'], ),
    sa.ForeignKeyConstraint(['engineer_id'], ['engineer.id'], ),
    sa.ForeignKeyConstraint(['provider_id'], ['provider.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('assets',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('asset_type', sa.String(length=50), nullable=False),
    sa.Column('asset_brand', sa.String(length=50), nullable=False),
    sa.Column('asset_model', sa.String(length=50), nullable=False),
    sa.Column('asset_serial', sa.String(length=50), nullable=False),
    sa.Column('asset_inventory_number', sa.String(length=50), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('admins_id', sa.Integer(), nullable=True),
    sa.Column('engineer_id', sa.Integer(), nullable=True),
    sa.Column('branch_id', sa.Integer(), nullable=True),
    sa.Column('migration_id', sa.Integer(), nullable=True),
    sa.Column('provider_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['admins_id'], ['admins.id'], ),
    sa.ForeignKeyConstraint(['branch_id'], ['branch.id'], ),
    sa.ForeignKeyConstraint(['engineer_id'], ['engineer.id'], ),
    sa.ForeignKeyConstraint(['migration_id'], ['migration.id'], ),
    sa.ForeignKeyConstraint(['provider_id'], ['provider.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('link',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('type', sa.String(length=50), nullable=False),
    sa.Column('description', sa.String(length=250), nullable=False),
    sa.Column('speed', sa.String(length=50), nullable=False),
    sa.Column('status', sa.String(length=50), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('admins_id', sa.Integer(), nullable=True),
    sa.Column('engineer_id', sa.Integer(), nullable=True),
    sa.Column('branch_id', sa.Integer(), nullable=True),
    sa.Column('provider_id', sa.Integer(), nullable=True),
    sa.Column('migration_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['admins_id'], ['admins.id'], ),
    sa.ForeignKeyConstraint(['branch_id'], ['branch.id'], ),
    sa.ForeignKeyConstraint(['engineer_id'], ['engineer.id'], ),
    sa.ForeignKeyConstraint(['migration_id'], ['migration.id'], ),
    sa.ForeignKeyConstraint(['provider_id'], ['provider.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('message',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('message', sa.String(length=250), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('migration_id', sa.Integer(), nullable=True),
    sa.Column('provider_id', sa.Integer(), nullable=False),
    sa.Column('branch_id', sa.Integer(), nullable=False),
    sa.Column('admins_id', sa.Integer(), nullable=True),
    sa.Column('engineer_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['admins_id'], ['admins.id'], ),
    sa.ForeignKeyConstraint(['branch_id'], ['branch.id'], ),
    sa.ForeignKeyConstraint(['engineer_id'], ['engineer.id'], ),
    sa.ForeignKeyConstraint(['migration_id'], ['migration.id'], ),
    sa.ForeignKeyConstraint(['provider_id'], ['provider.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('history',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date', sa.Date(), nullable=True),
    sa.Column('message', sa.String(length=250), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('provider_id', sa.Integer(), nullable=True),
    sa.Column('branch_id', sa.Integer(), nullable=True),
    sa.Column('migration_id', sa.Integer(), nullable=True),
    sa.Column('asset_id', sa.Integer(), nullable=True),
    sa.Column('admins_id', sa.Integer(), nullable=True),
    sa.Column('engineer_id', sa.Integer(), nullable=True),
    sa.Column('link_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['admins_id'], ['admins.id'], ),
    sa.ForeignKeyConstraint(['asset_id'], ['assets.id'], ),
    sa.ForeignKeyConstraint(['branch_id'], ['branch.id'], ),
    sa.ForeignKeyConstraint(['engineer_id'], ['engineer.id'], ),
    sa.ForeignKeyConstraint(['link_id'], ['link.id'], ),
    sa.ForeignKeyConstraint(['migration_id'], ['migration.id'], ),
    sa.ForeignKeyConstraint(['provider_id'], ['provider.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_mb',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('role', sa.String(length=50), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.Column('names', sa.String(length=50), nullable=False),
    sa.Column('last_names', sa.String(length=50), nullable=False),
    sa.Column('employee_number', sa.String(length=20), nullable=False),
    sa.Column('extension_phone', sa.String(length=50), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('asset_id', sa.Integer(), nullable=True),
    sa.Column('branch_id', sa.Integer(), nullable=True),
    sa.Column('admins_id', sa.Integer(), nullable=True),
    sa.Column('engineer_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['admins_id'], ['admins.id'], ),
    sa.ForeignKeyConstraint(['asset_id'], ['assets.id'], ),
    sa.ForeignKeyConstraint(['branch_id'], ['branch.id'], ),
    sa.ForeignKeyConstraint(['engineer_id'], ['engineer.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('employee_number')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_mb')
    op.drop_table('history')
    op.drop_table('message')
    op.drop_table('link')
    op.drop_table('assets')
    op.drop_table('migration')
    op.drop_table('provider')
    op.drop_table('branch')
    op.drop_table('engineer')
    op.drop_table('admins')
    op.drop_table('user')
    # ### end Alembic commands ###
