"""empty message

Revision ID: 7e7042fc2ba0
Revises: f7335bec524c
Create Date: 2024-10-28 16:34:24.569215

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7e7042fc2ba0'
down_revision = 'f7335bec524c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('provider', schema=None) as batch_op:
        batch_op.add_column(sa.Column('engineer_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(None, 'engineer', ['engineer_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('provider', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('engineer_id')

    # ### end Alembic commands ###
