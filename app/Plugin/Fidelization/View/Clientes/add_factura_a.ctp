<div data-role="page" id="clientes-addfacturaa">

<div data-role="header">
    <h1>Clientes</h1>
</div>
    
<div data-role="content" data-theme="f">
    <div id="form-cliente-a" class="clientes form">
        <?php echo $this->Form->create('Cliente', array( 
                                    'action'=>'addFacturaA', 
                                    'onsubmit' => 'return false;',
                                    'id' =>'form-cliente-add', 
                                    'data-ajax'=>'false'));?>
        <fieldset>
            <legend><?php __('Agregar Factura "A"');?></legend>
            <?php

            echo $this->Form->input('nombre',array('label'=>'Nombre/Denominación'));


            echo $this->Form->hidden('tipofactura',array('value'=>'A'));

            echo $this->Form->hidden('iva_responsabilidad_id',array('value'=>1)); // Resp. Inscripto, Numero hardcodeado de la base de datos

            echo $this->Form->hidden('tipo_documento_id', array('value' => 1)); // CUIT, numero hardcodeado de la base de datos


            echo $this->Form->input('nrodocumento',
                               array(
                                   'label'=>'Número (sin los guiones)',
                                   ));

           ?>
        </fieldset>
        <?php echo $this->Form->end('guardar');?>
    </div>
</div>

</div>