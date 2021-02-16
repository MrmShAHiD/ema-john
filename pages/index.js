import Link from 'next/link'
import baseUrl from '../helpers/baseUrl'
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth:"12rem",
    width:'12rem'
  },
  
  media: {
    height: 160,
  },
  gridContainer: {
    paddingLeft: "20px",
    paddingRight: "20px"
  }
});

const Home = ({products}) => {
  const productList = products.map(product =>{
    const classes = useStyles();
    return (
      <Grid container spacing={4} justify="center">
        <Grid item>
          <Card display="inline" className={classes.root} key={product._id}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={product.mediaUrl}
                title="product image"
              />
              <CardContent>
                <Typography variant="body2" component="p">
                  ${product.price}
                </Typography>
              </CardContent>
            </CardActionArea>
          <CardActions>
            <Link href={"/product/[id]"} as={`/product/${product._id}`}><a>View Product</a></Link>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  )
})

  return (
    <div>
      <h1 style={{marginLeft:"20px"}}>Available Products</h1>
      <div style={{display: 'flex'}}>
      <br/>
      {productList}
    </div>
    </div>
  
  )
}

// export async function getStaticProps(){
//   const res = await fetch(`${baseUrl}/api/products`)
//   const data = await res.json()
//   return {
//     props:{
//       products: data
//     }
//   }
// }

export async function getServerSideProps(){
  const res = await fetch(`${baseUrl}/api/products`)
  const data = await res.json()
  return {
    props:{
      products: data
    }
  }
}

export default Home