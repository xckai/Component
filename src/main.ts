import Backbone =require( 'Backbone');
class personView extends Backbone.View<Backbone.Model>{
    template="ahahahh"
    render(){
         this.$el.html(this.template);
        return this
    }
}
let p=new personView({el:"#app"})